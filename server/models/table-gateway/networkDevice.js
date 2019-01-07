const Table = require('chinchay').Table; // eslint-disabled-this-line no-unused-vars
// const Table = require('../../../services/models/table');


class NetworkDevice extends Table {
  constructor() {
    const table_name = 'network_device';
    super(table_name);
  }

  groupBy() {
    return new Promise((resolve, reject) => {
      this.all().then((result) => {
        const json = groupByPlace(result);
        resolve(json);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

function groupByPlace(json) {
  const response = {};
  json.forEach((element) => {
    if (!response[element.place_id]) {
      response[element.place_id] = {};
    }
    response[element.place_id][element.ip] = {
      ip: element.ip,
      friendly_name: element.friendly_name,
      is_up: element.is_up,
      id: element.id,
      method: element.method,
      mac_address: element.mac_address,
    };
  });
  return response;
}


const instance = new NetworkDevice();


module.exports = instance;
