const subscriptions = require('./radius/samples');

exports.seed = function (knex, Promise) {
  const subscriptionPromises = [];
  subscriptions.forEach((subscription) => {
    subscriptionPromises.push(createSubscription(knex, subscription));
  });
  return Promise.all(subscriptionPromises);
};

function createSubscription(knex, subscription) {
  return knex.table('subscription')
    .returning('*')
    .insert(subscription);
}
