const mikrotikApi = require('./mikrotik-api');
// const SpeedBot = require('./speedBot');
const Places = require('./table-gateway/places'); // eslint-disable-line

const stats = {};
const apiWatchTime = 1000 * 60 * 1;
// deploy


const setStatusWorking = (place_id, task) => {
  if (task === 'speed_user_monitor') { stats[place_id].speed_user_monitor = 'working'; }
  if (task === 'cpu_and_memory') { stats[place_id].cpu_and_memory = 'working'; }
};

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const all = () => {
  Places.all().then((places) => {
    for (let i = 0; i < places.length; i++) {
      getRouterData(places[i]);
    }
    delay(apiWatchTime).then(() => {
      all();
    });
  }).catch(() => {
    // console.log(err, 'database Problem');
    delay(apiWatchTime).then(() => {
      all();
    });
  });
};

function getRouterData(place) {
  mikrotikApi.getRouterData(place).then(() => {
    stats[place.place_id] = {
      interface_speed: 'working',
      cpu_and_memory: 'working',
      active_user: 'working',
    };
  }).catch(() => {
    // console.log(err);
    stats[place.place_id] = {
      interface_speed: 'down',
      cpu_and_memory: 'down',
      active_user: 'down',
    };
  });
}

const getStatus = () => {
  return stats;
};

module.exports = {
  all,
  getStatus,
  setStatusWorking,
};
