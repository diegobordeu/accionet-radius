process.env.NODE_ENV = 'test';
const AlertManager = require('../../../models/alertManager');
const NetworkDevices = require('../../../models/table-gateway/networkDevice');
const knex = require('../../../../db/knex');
const chai = require('chai'); // eslint-disable-line
const assert = chai.assert;
// const waitForRecord = 2500;


describe('doubleCheck method', () => { // eslint-disable-line
  beforeEach(async () => { // eslint-disable-line
    await knex('network_device').del();
  });

  it('json[id] should be null (already checked)', async () => { // eslint-disable-line
    const db = await initDown();
    AlertManager.doubleCheck(findQuery(), false);
    const json = await AlertManager.getJson();
    await delay(500);
    assert.isDefined(json[db.id], 'json[id] should be defined');
    assert.equal(json[db], null);
  });
  it('json[id] should be null (already checked)', async () => { // eslint-disable-line
    const db = await initUp();
    AlertManager.doubleCheck(findQuery(), true);
    const json = await AlertManager.getJson();
    await delay(500);
    assert.isDefined(json[db.id], 'json[id] should be defined');
    assert.equal(json[db.id], null);
  });
});

function delay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, delay);
  });
}


const initDown = async() => {
  const device = findQuery();
  device.is_up = false;
  return await NetworkDevices.save(device);
};

const initUp = async() => {
  const device = findQuery();
  device.is_up = true;
  return await NetworkDevices.save(device);
};


function findQuery() {
  return {
    place_id: 1,
    ip: '1.1.1.1',
  };
}
