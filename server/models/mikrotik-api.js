
const MikroNode = require('mikronode');
const Router_stats = require('./table-gateway/router_stats');
const Places = require('./table-gateway/places');
// const monitor = require('./monitor');

const listenTimeOut = 5 * 1000;
const IDLE_TIME_OUT = 30; // SECONDS, not milliseconds

function getPlaceDevice(place_id) {
  return new Promise((resolve, reject) => {
    Places.all().then((places) => {
      const place = getEspecificPlace(places, place_id);
      resolve(new MikroNode(place.ip, place.api_port));
    }).catch((err) => {
      reject(err);
    });
  });
}

function getEspecificPlace(places, place_id) {
  for (let i = 0; i < places.length; i++) {
    if (places[i].place_id === place_id) {
      return places[i];
    }
  }
  return null;
}


function connect(place_id) {
  return new Promise((resolve, reject) => {
    getPlaceDevice(place_id).then((Device) => {
      Device.connect().then(([login]) => {
        return login(process.env.MIKROTIK_API_USER, process.env.MIKROTIK_API_PASSWORD).then((conn) => {
          return resolve(conn); // results
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}
// getWhatEver('/interface/wireless/registration-table/getall').then((a) => { return console.log(a); }).catch((err) => { return console.log(err); });
// getLogs(0).then((a) => { return console.log(a); }).catch((err) => { return console.log(err); });
// getCpuAndMemory(0).then((a) => { return console.log(a); }).catch((err) => { return console.log(err); });
// getInterfacesBPS(0).then(a => console.log(a)).catch(err => console.log(err));
// getInterfacesFTBPS(0).then(a => console.log(a)).catch(err => console.log(err));
// loginMacAddress('80:AD:16:E4:DA:DD',0).then(a => console.log(a, 'exito')).catch(err => console.log(err, 'fallo'));
// loginMacAddressBinding('80:AD:16:E4:DA:DD',0).then(a => console.log(a, 'exito')).catch(err => console.log(err, 'fallo'));

// getUsersInfo().then((a) => { return console.log(a); }).catch((err) => { return console.log(err); });

exports.getRouterData = async (place) => {
  const conn = await connect(place.place_id);
  const cpuCh = await cpuChannel(conn);
  let interfaceCh;
  if (place.master_interface) {
    interfaceCh = await interfaceChannel(conn, place.master_interface);
  }
  const userCh = await userChannel(conn);
  conn.close();
  if (!cpuCh && !interfaceCh && !userCh) {
    throw new Error(`mikrotik api failed on place ${place.place_id}`);
  }
  const response = {
    cpu: cpuCh,
    interface: interfaceCh,
    user: userCh,
  };
  return await saveData(response, place.place_id);
};

function cpuChannel(conn) {
  return new Promise((resolve) => {
    const ch = conn.openChannel();
    ch.closeOnDone(true);
    ch.data.timeout(listenTimeOut).subscribe(
      (data) => {
        data = parseDataFromArray(data.data);
        ch.close();
        return resolve(data);
      },
      () => { // (e) => {
        ch.close();
        return resolve();
        // return reject(e.message);
      });
    ch.trap.subscribe(() => {
      ch.close();
      // reject(err.data[0].value);
      return resolve();
    });
    ch.write('/system/resource/monitor');
  });
}

function interfaceChannel(conn, interfaceName) {
  return new Promise((resolve) => {
    const ch = conn.openChannel();
    ch.closeOnDone(true);
    ch.data.subscribe((data) => {
      ch.close();
      resolve(parseInterferenceRate(data.data));
    },
    () => { // (e) => {
      ch.close();
      // return reject(e.message);
      resolve();
    });
    ch.trap.subscribe(() => {
      ch.close();
      // reject(err.data[0].value);
      resolve();
    });
    ch.write('/interface/monitor-traffic', {
      interface: interfaceName,
    });
  });
}

function userChannel(conn) {
  return new Promise((resolve) => {
    const ch = conn.openChannel();
    ch.closeOnDone(true);
    ch.done.subscribe((data) => {
      resolve(parseUserInfo(data.data));
    },
    () => { // (e) => {
      ch.close();
      // return reject(e.message);
      return resolve();
    });
    ch.trap.subscribe(() => {
      ch.close();
      // reject(err.data[0].value);
      return resolve();
    });
    ch.write('/ip/hotspot/active/print');
  });
}

const saveData = async (data, place_id) => {
  const struct = await Router_stats.new();
  struct.place_id = place_id;
  if (data.cpu) {
    struct.cpu_usage = Math.round(data.cpu['cpu-used']);
    struct.free_memory = Math.round(data.cpu['free-memory']);
  }
  if (data.user) {
    struct.users = Math.round(data.user.users);
    struct.active_users = Math.round(data.user.activeUser);
  }
  if (data.interface) {
    struct.rx_rate = Math.round(data.interface.rx);
    struct.tx_rate = Math.round(data.interface.tx);
  }
  const saveTask = await Router_stats.save(struct);
  return saveTask;
};

function parseInterferenceRate(data) {
  const parsedData = parseDataFromArray(data);
  const rx = parsedData['rx-bits-per-second'];
  const tx = parsedData['tx-bits-per-second'];
  return { rx, tx };
}

function getLogs(place_id) { // eslint-disable-line
  return new Promise((resolve, reject) => {
    connect(place_id).then((conn) => {
      const ch = conn.openChannel('listen');
      ch.closeOnDone(true);
      ch.done.subscribe((data) => {
        resolve(parseDataToJson(data.data));
      });
      ch.trap.subscribe((err) => {
        reject(err.data[0].value);
      });
      ch.write('/log/print');
    }).catch((err) => {
      reject(err);
    });
  });
}


function parseUserInfo(data) { // return user connected and active user
  const fixedData = parseDataToJson(data);
  let activeUser = 0;
  for (let i = 0; i < fixedData.length; i++) {
    if (!fixedData[i]['idle-time'].includes('m') && !fixedData[i]['idle-time'].includes('h') && fixedData[i]['idle-time'].includes('s')) {
      if (fixedData[i]['idle-time'].split('s')[0] < IDLE_TIME_OUT) { // active user are the ones that user the connection for more than 10 seconds
        activeUser++;
      }
    }
  }
  return {
    activeUser,
    users: fixedData.length,
  };
}

function getWhatEver(query, place_id) {  // eslint-disable-line
  return new Promise((resolve, reject) => { // get bytes in and out, seccion time, seccion time left
    connect(place_id).then((conn) => {
      const ch = conn.openChannel('listen');
      ch.closeOnDone(true);
      ch.done.subscribe((data) => {
        resolve(parseDataToJson(data.data));
      });
      ch.trap.subscribe((err) => {
        reject(err.data[0].value);
      });
      ch.write(query);
    }).catch((err) => {
      reject(err);
    });
  });
}

function loginMacAddressBinding(macAddress, place_id) { // eslint-disable-line
  return new Promise((resolve, reject) => {
    connect(place_id).then((conn) => {
      const ch = conn.openChannel();
      ch.closeOnDone(true);
      ch.done.subscribe((data) => {
        resolve(data);
      });
      ch.trap.subscribe((err) => {
        reject(err.data[0].value);
      });
      ch.write('/ip/hotspot/ip-binding/add',
        {
          comment: 'test',
          disabled: 'no',
          type: 'bypassed',
          'mac-address': macAddress,
        });
    }).catch((err) => {
      reject(err);
    });
  });
}

function loginMacAddress(macAddress, place_id) { // eslint-disable-line
  return new Promise((resolve, reject) => {
    connect(place_id).then((conn) => {
      const ch = conn.openChannel();
      ch.closeOnDone(true);
      findHostIp(macAddress, conn).then((ip) => {
        ch.done.subscribe((data) => {
          resolve(data);
        });
        ch.trap.subscribe((err) => {
          reject(err.data[0].value);
        });
        ch.write('/ip/hotspot/active/login',
          {
            user: 'admin', // TODO: change password pass=NODE_ENV_PROD.loginPass
            'mac-address': macAddress,
            ip,
          });
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function parseDataToJson(data) { // [{{},{}},{{},{}}.....{}] => [[{},{}....{}]
  const response = [];
  data.forEach((element) => {
    const subResponse = {};
    element.forEach((subElement) => {
      subResponse[subElement.field] = subElement.value;
    });
    response.push(subResponse);
  });
  return response;
}

function parseDataFromArray(data) { // [{},{}.....{}] => {}
  const response = {};
  data.forEach((element) => {
    response[element.field] = Math.round(parseFloat(element.value));
  });
  return response;
}


function findHostIp(macAddress, conn) {
  return new Promise((resolve, reject) => {
    const channel = conn.openChannel();
    channel.closeOnDone(true);
    channel.done.subscribe((data) => {
      const ip = getIpFromData(data.data, macAddress);
      if (ip) {
        resolve(ip);
      } else {
        reject('Failed: Mac address not found in hotspot hosts list');
      }
    });
    channel.trap.subscribe((err) => {
      reject(err.data[0].value);
    });
    channel.write('/ip/hotspot/host/print');
  });
}

function getIpFromData(data, macAddress) {
  data = parseDataToJson(data);
  for (let i = 0; i < data.length; i++) {
    if (data[i]['mac-address'] === macAddress) {
      return data[i].address;
    }
  }
  return false;
}
