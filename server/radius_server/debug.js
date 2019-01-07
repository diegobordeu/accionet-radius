const RadiusServer = require('./mk-radius-server');
const RadiusClient = require('./radius-client');

RadiusServer.start();
RadiusClient.start();

const doit = async () => {
  RadiusClient.sendPackage(RadiusClient.mkPackage('AA:BB:CC:DD:00:11'));
};

doit();
