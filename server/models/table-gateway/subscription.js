const Table = require('chinchay').Table; // eslint-disabled-this-line no-unused-vars


class Subscription extends Table {
  constructor() {
    const table_name = 'subscription';
    super(table_name);
  }
}


const instance = new Subscription();


module.exports = instance;
