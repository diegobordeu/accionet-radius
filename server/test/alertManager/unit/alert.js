process.env.NODE_ENV = 'test';
const AlertManager = require('../../../models/alertManager');
const NetworkDevices = require('../../../models/table-gateway/networkDevice');
const knex = require('../../../../db/knex');
const chai = require('chai'); // eslint-disable-line
const assert = chai.assert;
// const waitForRecord = 2500;


describe('alert method', () => { // eslint-disable-line
  beforeEach(async () => { // eslint-disable-line
    await knex('network_device').del();
  });

  it('should return "no mandar mail" after DOWN -> DOWN', async () => { // eslint-disable-line
    await initDown();
    const alert = await AlertManager.alert(findQuery(), false);
    assert.equal(alert, 'no mandar mail');
  });
  it('should return "no mandar mail" after UP -> UP', async () => { // eslint-disable-line
    await initUp();
    const alert = await AlertManager.alert(findQuery(), true);
    assert.equal(alert, 'no mandar mail');
  });
  it('should record that db.id was changed after UP -> DOWN', async () => { // eslint-disable-line
    const db = await initUp();
    await AlertManager.alert(findQuery(), false);
    const json = await AlertManager.getJson();
    assert.isDefined(json[db.id], 'json[id] should exist');
    assert.equal(json[db.id], false);
  });
  it('should record that db.id was changed after UP -> DOWN', async () => { // eslint-disable-line
    const db = await initDown();
    await AlertManager.alert(findQuery(), true);
    const json = await AlertManager.getJson();
    assert.isDefined(json[db.id], 'json[id] should exist');
    assert.equal(json[db.id], true);
  });
});


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
