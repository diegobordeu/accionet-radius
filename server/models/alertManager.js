const NetworkDevices = require('./table-gateway/network_devices');
const Mailer = require('./mailer');
const Mail = require('./table-gateway/mail');
const Utils = require('codemaster').utils;
const requestify = require('requestify');

let CHECK_TIME_INTERVAL = 5 * 60 * 1000; // TODO: change before deply 5 minitues
let json = {};

let CHECK_INTERVAL = 5 * 60 * 1000;
let THRESHOLD_INTERVAL = 5 * 60 * 1000;
let testRecords = [];


if (process.env.NODE_ENV === 'test') {
  CHECK_INTERVAL = 1 * 1 * 1000;
  THRESHOLD_INTERVAL = 1 * 1 * 1000;
  CHECK_TIME_INTERVAL = 1 * 1 * 1000;
}

const alert = async (query, isUp) => { // isUp true o false
  const newQuery = Utils.cloneJSON(query);
  const actual = await NetworkDevices.find(newQuery);
  if (actual[0].is_up === isUp) {
    return 'no mandar mail';
  }
  await NetworkDevices.update(actual[0].id, { is_up: isUp });
  if (typeof (json[actual[0].id]) === 'undefined' || json[actual[0].id] === null) {
    json[actual[0].id] = isUp;
    checkDelayChanges(query, isUp);
  }
};


setInterval(async () => {
  const fallenDevices = await NetworkDevices.find({ method: 'polling', is_up: 'true' });
  const now = new Date().getTime();
  const threshold = new Date(now - THRESHOLD_INTERVAL).getTime();
  for (let i = 0; i < fallenDevices.length; i++) {
    if (new Date(fallenDevices[i].status_update_at).getTime() < threshold) {
      notifyPollingDeviceDown(fallenDevices[i], false);
      await NetworkDevices.update(fallenDevices[i].id, { is_up: 'false' });
    }
  }
}, CHECK_INTERVAL);

function notifyPollingDeviceDown(device, is_up) {
  triggerAlert(device.place_id, device.ip, device.friendly_name, is_up);
}

exports.notifyPollingDeviceUp = (device) => {
  triggerAlert(device.place_id, device.ip, device.friendly_name, true);
};

function checkDelayChanges(query, isUp) {
  setTimeout(() => {
    doubleCheck(query, isUp);
  }, CHECK_TIME_INTERVAL);
}

const doubleCheck = (query, isUp) => {
  NetworkDevices.find(query).then((newActual) => {
    if (newActual[0].is_up === isUp && json[newActual[0].id] === isUp) {
      triggerAlert(newActual[0].place_id, newActual[0].ip, newActual[0].friendly_name, isUp);
    }
    json[newActual[0].id] = null;
  }).catch();
};

function getPlacesName(place_id) {
  return new Promise((resolve, reject) => {
    requestify.get('https://www.accionet.net/api/v1/places/all/names').then((data) => {
      const placesInfo = data.getBody().data;
      for (let i = 0; i < placesInfo.length; i++) {
        if (placesInfo[i].id === place_id) {
          return resolve(placesInfo[i].name);
        }
      }
      return 'name not found';
    }).catch((err) => {
      reject(err);
    });
  });
}

function triggerAlert(place_id, ip, friendly_name, isUp) {
  getPlacesName(place_id).then((name) => {
    let text = `Se ha RECUPERADO la Antena o dispositivo (${friendly_name}) de ip = ${ip} del lugar (${place_id})`;
    let subject = `${friendly_name} de Lugar ${name} (${place_id}) UP`;
    if (!isUp) {
      text = `Se ha CAIDO la Antena o dispositivo (${friendly_name}) de ip = ${ip} del lugar (${place_id}) https://mrmeeseek.herokuapp.com/front/network-device`;
      subject = `${friendly_name} de Lugar ${name} (${place_id}) DOWN`;
    }
    Mail.find({ is_active: true }).then((results) => {
      const mailTargets = [];
      results.forEach((element) => {
        mailTargets.push(element.address);
      });
      if (process.env.NODE_ENV === 'test') {
        testRecords.push({
          name,
          place_id,
          ip,
          isUp,
        });
      }
      Mailer.send(mailTargets, text, subject);
    });
  });
}

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    doubleCheck,
    alert,
    triggerAlert,
    showRecords: () => {
      return new Promise((resolve) => {
        return resolve(testRecords);
      });
    },
    reSetRecord: () => {
      testRecords = [];
    },
    getJson: () => {
      return new Promise((resolve) => {
        return resolve(json);
      });
    },
    setJson: (input) => {
      json = input;
    },
  };
}
