
exports.up = function (knex) {
  return knex.schema.table('router_stats', (table) => {
    table.integer('users');
    table.integer('active_users');
    table.integer('rx_rate');
    table.integer('tx_rate');
  });
};

exports.down = function (knex) {
  return knex.schema.table('router_stats', (table) => {
    table.dropColumn('users');
    table.dropColumn('active_users');
    table.dropColumn('rx_rate');
    table.dropColumn('tx_rate');
  });
};
