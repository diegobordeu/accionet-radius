const Table = require('chinchay').Table; // eslint-disabled-this-line no-unused-vars


class Mail extends Table {
  constructor() {
    const table_name = 'mail';
    super(table_name);
  }
}


const instance = new Mail();


module.exports = instance;
