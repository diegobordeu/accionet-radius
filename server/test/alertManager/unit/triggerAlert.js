process.env.NODE_ENV = 'test';
const AlertManager = require('../../../models/alertManager');

const chai = require('chai'); // eslint-disable-line
const assert = chai.assert;
// const waitForRecord = 2500;


describe('triggerAlert method', () => { // eslint-disable-line
  it('should send mail ', async () => { // eslint-disable-line
    AlertManager.reSetRecord();
    await AlertManager.triggerAlert(1, 1, 1, false);
    await delay(2000);
    const mails = await AlertManager.showRecords();
    assert.isDefined(mails[0], 'mail should be sent');
    assert.equal(mails[0].isUp, false, 'wrong mail');
  });
  it('should send mail ', async () => { // eslint-disable-line
    await AlertManager.triggerAlert(1, 1, 1, true);
    await delay(2000);
    const mails = await AlertManager.showRecords();
    assert.isDefined(mails[1], 'mail should be sent');
    assert.equal(mails[1].isUp, true, 'wrong mail');
  });
});

function delay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, delay);
  });
}
