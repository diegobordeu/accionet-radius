
exports.up = function (knex) {
  return knex.schema.raw('ALTER TABLE access_point RENAME TO network_device');
};

exports.down = function (knex) {
  return knex.schema.raw('ALTER TABLE network_device RENAME TO access_point');
};
