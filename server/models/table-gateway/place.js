const Table = require('chinchay').Table; // eslint-disabled-this-line no-unused-vars


class Place extends Table {
  constructor() {
    const table_name = 'places';
    super(table_name);
  }
}


const instance = new Place();


module.exports = instance;
