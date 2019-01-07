
exports.up = function (knex) {
  return knex.schema.raw('ALTER TABLE subscription ADD COLUMN expire_date timestamp with time zone;');
};

exports.down = function (knex) {
  return knex.schema.raw('ALTER TABLE subscription DROP COLUMN expire_date;');
};
