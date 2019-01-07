const Table = require('../../../services/models/table'); // eslint-disable-line no-unused-vars


class NetworkDevices extends Table {

  constructor() {
    const table_name = 'network_device'; // access_point as well for db porpuse
    super(table_name);
  }

  groupBy() {
    return new Promise((resolve, reject) => {
      this.all().then((result) => {
        const json = parseArrayTojson(result);
        resolve(json);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

function parseArrayTojson(json) {
  const response = {};
  json.forEach((element) => {
    if (!response[element.place_id]) {
      response[element.place_id] = {};
    }
    response[element.place_id][element.ip] = {
      ip: element.ip,
      friendly_name: element.friendly_name,
      is_up: element.is_up,
    };
  });
  return response;
}

const instance = new NetworkDevices();

module.exports = instance;
