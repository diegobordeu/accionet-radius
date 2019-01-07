
exports.up = function (knex) {
  return knex.schema.table('network_device', (table) => {
    table.string('method');
  });
};

exports.down = function (knex) {
  return knex.schema.table('network_device', (table) => {
    table.dropColumn('method');
  });
};
