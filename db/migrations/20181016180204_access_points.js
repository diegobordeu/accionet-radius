
exports.up = function (knex) {
  return knex.schema.createTable('access_point', (table) => {
    // Incremental id
    table.increments();
    table.integer('place_id');
    table.string('ip');
    table.string('friendly_name');
    table.boolean('is_up');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('access_point');
};
