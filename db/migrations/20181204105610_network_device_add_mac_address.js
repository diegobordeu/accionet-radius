
exports.up = function (knex) {
  return knex.schema.table('network_device', (table) => {
    table.string('mac_address');
  });
};

exports.down = function (knex) {
  return knex.schema.table('network_device', (table) => {
    table.dropColumn('mac_address');
  });
};
