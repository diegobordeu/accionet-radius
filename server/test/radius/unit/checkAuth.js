process.env.NODE_ENV = 'test';
const RadiusServer = require('../../../radius_server/mk-radius-server');
const Subscription = require('../../../models/table-gateway/subscription');
const knex = require('../../../../db/knex');
const chai = require('chai'); // eslint-disable-line
const assert = chai.assert;


describe('functionality', () => { // eslint-disable-line
  before(async () => { // eslint-disable-line
    knex.seed.run();
  });
  it('should return true when asking for valid subscriber', async () => { // eslint-disable-line
    const auth = await RadiusServer.checkAuth('AA:BB:CC:DD:00:11');
    assert.equal(auth, true);
  });
  it('should return false when asking for expired subscriber', async () => { // eslint-disable-line
    const auth = await RadiusServer.checkAuth('AA:BB:CC:DD:00:22');
    assert.equal(auth, false);
  });
  it('should return false when asking for no subscriber', async () => { // eslint-disable-line
    const auth = await RadiusServer.checkAuth('XX.XX.XX.XX.XX.XX');
    assert.equal(auth, false);
  });
  describe('Malisuis', () => { //eslint-disable-line
    it('DB shouldnT crash with sql injection Query', async () => { // eslint-disable-line
      const dbBefore = await Subscription.find({}).length;
      const auth = await RadiusServer.checkAuth('105; DROP TABLE Subscription');
      const dbAfter = await Subscription.find({}).length;
      assert.equal(auth, false);
      assert.equal(dbAfter, dbBefore);
    });
    it('Authentication sql injection', async () => { // eslint-disable-line
      const auth = await RadiusServer.checkAuth('" or ""="');
      assert.equal(auth, false);
    });
  });
});
