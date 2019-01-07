process.env.NODE_ENV = 'test';
const AlertManager = require('../../../models/alertManager');
const NetworkDevices = require('../../../models/table-gateway/networkDevice');
const knex = require('../../../../db/knex');
const chai = require('chai'); // eslint-disable-line
const assert = chai.assert;


describe('When Up request from polling Device are arriving', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex('network_device').del();
    await initUp();
    AlertManager.reSetRecord();
  });

  it('Shouldn´t send mail, device working fine', async () => { // eslint-disable-line
    for (let i = 0; i < 5; i++) {
      await pollingReq();
      await delay(200);
    }
    const record = await AlertManager.showRecords();
    assert.isUndefined(record[0], 'mail shouldn´t be sent');
  });
});

describe('When no Up request are arriving', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    await knex('network_device').del();
    await initUp();
    AlertManager.reSetRecord();
  });

  it('Should send mail, device stop sending polling request', async () => { // eslint-disable-line
    for (let i = 0; i < 5; i++) {
      await pollingReq();
      await delay(200);
    }
    await delay(1500);
    const record = await AlertManager.showRecords();
    assert.isDefined(record[0], 'no mail was sent');
    assert.equal(record[0].isUp, false, 'wrong mail sent');
    assert.equal(record.length, 1, 'more than 1 mail were sent');
  });
});

const pollingReq = async () => {
  const device = await NetworkDevices.find(findQuery());
  await NetworkDevices.update(device[0].id, { is_up: true });
};


function delay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, delay);
  });
}


function findQuery() {
  return {
    place_id: 1,
    ip: '1.1.1.1',
    method: 'polling',
  };
}

// const initDown = async() => {
//   const device = findQuery();
//   device.is_up = false;
//   await NetworkDevices.save(device);
//   return;
// };

const initUp = async() => {
  const device = findQuery();
  device.is_up = true;
  await NetworkDevices.save(device);
  return;
};
