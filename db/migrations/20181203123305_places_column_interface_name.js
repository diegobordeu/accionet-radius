
exports.up = function (knex) {
  return knex.schema.table('places', (table) => {
    table.string('master_interface');
  });
};

exports.down = function (knex) {
  return knex.schema.table('places', (table) => {
    table.dropColumn('master_interface');
  });
};
