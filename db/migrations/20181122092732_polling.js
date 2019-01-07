
exports.up = function (knex) {
  return knex.schema.raw('ALTER TABLE network_device ADD COLUMN status_update_at timestamp with time zone;');
};

exports.down = function (knex) {
  return knex.schema.raw('ALTER TABLE network_device DROP COLUMN status_update_at;');
};
