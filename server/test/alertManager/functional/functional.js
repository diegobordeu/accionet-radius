process.env.NODE_ENV = 'test';
const AlertManager = require('../../../models/alertManager');

const NetworkDevices = require('../../../models/table-gateway/networkDevice');
const knex = require('../../../../db/knex');
const chai = require('chai'); // eslint-disable-line
const assert = chai.assert;


const waitForRecord = 3500;


describe('should send notify mail when devcie change from status', () => { // eslint-disable-line

  describe('down -> Up', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex('network_device').del();
      await initDown();
      AlertManager.reSetRecord();
    });

    it('should send Up notification mail', async () => { // eslint-disable-line
      await AlertManager.alert(findQuery(), true);
      await delay(waitForRecord);
      const record = await AlertManager.showRecords();
      assert.isDefined(record[0], 'mail not sent');
      assert.isBoolean(record[0].isUp);
      assert.isTrue(record[0].isUp, 'wrong email');
    });
  });

  describe('Up -> Down', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      await knex('network_device').del();
      await initUp();
      AlertManager.reSetRecord();
    });

    it('should send down notification mail', async () => { // eslint-disable-line
      AlertManager.alert(findQuery(), false);
      await delay(waitForRecord);
      const record = await AlertManager.showRecords();
      assert.isDefined(record[0], 'mail not sent');
      assert.isBoolean(record[0].isUp);
      assert.isFalse(record[0].isUp, 'wrong email');
    });
  });
});

describe('should not notify mail after same status request:', () => { // eslint-disable-line
  describe('For Down requests', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      AlertManager.reSetRecord();
      await knex('network_device').del();
      await initDown();
    });
    it('should not send anything', async () => { // eslint-disable-line
      await AlertManager.alert(findQuery(), false);
      await delay(200);
      await AlertManager.alert(findQuery(), false);
      await delay(200);
      await AlertManager.alert(findQuery(), false);
      await delay(waitForRecord);
      const record = await AlertManager.showRecords();
      assert.isUndefined(record[0], 'emal should not be sent');
    });
  });

  describe(' For Up requests:', () => { // eslint-disable-line
    before(async () => { // eslint-disable-line
      AlertManager.reSetRecord();
      await knex('network_device').del();
      await initUp();
    });
    it('should not send anything', async () => { // eslint-disable-line
      await AlertManager.alert(findQuery(), true);
      await delay(200);
      await AlertManager.alert(findQuery(), true);
      await delay(200);
      await AlertManager.alert(findQuery(), true);
      await delay(waitForRecord);
      const record = await AlertManager.showRecords();
      assert.isUndefined(record[0], 'emal should not be sent');
    });
  });
});

describe('should not notify mail after a fast recover ', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    AlertManager.reSetRecord();
    await knex('network_device').del();
    await initUp();
  });

  it('Should not send mail', async () => { // eslint-disable-line
    await AlertManager.alert(findQuery(), true);
    await delay(200);
    await AlertManager.alert(findQuery(), false);
    await delay(200);
    await AlertManager.alert(findQuery(), true);
    await delay(waitForRecord);
    const record = await AlertManager.showRecords();
    assert.isUndefined(record[0], 'emal should not be sent');
  });
});

describe('should not notify mail after wrong recover ', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    AlertManager.reSetRecord();
    await knex('network_device').del();
    await initDown();
  });
  it('Should not send mail', async () => { // eslint-disable-line
    await AlertManager.alert(findQuery(), false);
    await delay(200);
    await AlertManager.alert(findQuery(), true); // wierd false Up request
    await delay(200);
    await AlertManager.alert(findQuery(), false);
    await delay(waitForRecord);
    const record = await AlertManager.showRecords();
    assert.isUndefined(record[0], 'emal should not be sent');
  });
});

describe('test extreme case ', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    AlertManager.reSetRecord();
    await knex('network_device').del();
    await initUp();
  });
  it('Should send only 1 mail', async () => { // eslint-disable-line
    await AlertManager.alert(findQuery(), false);
    await delay(200);
    await AlertManager.alert(findQuery(), true);
    await delay(200);
    await AlertManager.alert(findQuery(), false);
    await delay(200);
    await AlertManager.alert(findQuery(), false);
    await delay(200);
    await delay(waitForRecord);
    const record = await AlertManager.showRecords();
    assert.isDefined(record[0], 'no mail was sent');
    assert.equal(record[0].isUp, false, 'wrong mail sent');
    assert.equal(record.length, 1, 'more tha one mail was sent');
  });
});


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
  };
}

const initDown = async() => {
  const device = findQuery();
  device.is_up = false;
  await NetworkDevices.save(device);
  return;
};

const initUp = async() => {
  const device = findQuery();
  device.is_up = true;
  await NetworkDevices.save(device);
  return;
};
