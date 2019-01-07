
exports.up = function (knex) {
  return knex.schema.raw('ALTER SEQUENCE access_point_id_seq RENAME TO network_device_id_seq;');
};

exports.down = function (knex) {
  return knex.schema.raw('ALTER SEQUENCE network_device_id_seq RENAME TO access_point_id_seq;');
};
