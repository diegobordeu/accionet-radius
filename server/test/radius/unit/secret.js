process.env.NODE_ENV = 'test';
const RadiusServer = require('../../../radius_server/mk-radius-server');
const RadiusClient = require('../../../radius_server/radius-client');
const chai = require('chai'); // eslint-disable-line
const assert = chai.assert;


describe('secret', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    RadiusServer.start();
    RadiusClient.start();
  });
  beforeEach(async () => { // eslint-disable-line
    RadiusServer.reSetRecord();
    RadiusServer.reSetSendedPacket();
  });

  it('Server Shouldn accept a packet with wrong secret', async () => { // eslint-disable-line
    RadiusClient.sendPackage(RadiusClient.packet_wrong_secret);
    await delay(500);
    const record = RadiusServer.showRecord();
    assert.isDefined(record[0], 'error must exist');
    assert.isUndefined(RadiusServer.showSendendPacket()[0], 'no packet should be sended by server ');
  });
  it('Should accept a apcket with rigth secret', async () => { // eslint-disable-line
    RadiusClient.sendPackage(RadiusClient.mkPackage('AA:BB:CC:DD:00:11'));
    await delay(500);
    const record = RadiusServer.showRecord();
    const sendedPackets = RadiusServer.showSendendPacket();
    assert.isUndefined(record[0], 'error must not exist');
    assert.isDefined(sendedPackets[0], 'no packet should be sended by server ');
  });
});
after(()=> { // eslint-disable-line
  RadiusServer.close();
  RadiusClient.close();
});

function delay(milli) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, milli);
  });
}
