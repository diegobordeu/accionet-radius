const path = require('path');

module.exports = {
  models: {
    directory: path.join(__dirname, 'server/models/table-gateway'),
    superclass: path.join(__dirname, '/services/models/tableGateway/table')
  },
  controllers: {
    directory: path.join(__dirname, 'server/controllers')
  },
  views: {
    directory: path.join(__dirname, 'client/views')
  },
  routes: {
    directory: path.join(__dirname, 'server/routes')
  },
  knex:  path.join(__dirname, 'db/knex.js')
};
