exports.up = function (knex) {
  return knex.schema.createTable('places', (table) => {
    // Incremental id
    table.increments();
    table.integer('place_id');
    table.string('ip');
    table.integer('webfix_port');
    table.integer('api_port');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('places');
};
