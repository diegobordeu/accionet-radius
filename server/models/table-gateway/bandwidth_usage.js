const Table = require('../../../services/models/table'); // eslint-disable-line no-unused-vars


class Bandwidth_usage extends Table {

  constructor() {
    const table_name = 'bandwidth_usage';
    super(table_name);
  }

  mergeAndSavePictures(picturesArray, place_id) {
    const f = async() => {
      const struct = await this.new();
      const macAddress = Object.keys(picturesArray[0]);
      for (let i = 0; i < macAddress.length; i++) {
        const userResponse = struct;
        userResponse.upload = Math.max(
          getRate(picturesArray[0][macAddress[i]].RxRate || 0),
          getRate(picturesArray[1][macAddress[i]].RxRate || 0),
          getRate(picturesArray[2][macAddress[i]].RxRate || 0),
        );
        userResponse.download = Math.max(
          getRate(picturesArray[0][macAddress[i]].TxRate || 0),
          getRate(picturesArray[1][macAddress[i]].TxRate || 0),
          getRate(picturesArray[2][macAddress[i]].TxRate || 0),
        );
        userResponse.mac_address = picturesArray[0][macAddress[i]].macAddress;
        userResponse.extracted_time = new Date();
        userResponse.place_id = place_id;
        await this.save(userResponse);
      }
    };
    return f();
  }
}

function getRate(string) {
  if (string !== 0) {
    let multiplier = 1;
    const rate = string.split(' ');
    switch (rate[1]) {
    case 'bps':
      multiplier = 1;
      break;
    case 'kbps':
      multiplier = 1000;
      break;
    case 'Mbps':
      multiplier = 1000 * 1000;
      break;
    default:
    }
    return rate[0] * multiplier;
  }
  return 0;
}

const instance = new Bandwidth_usage();

module.exports = instance;
