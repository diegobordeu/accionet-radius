exports.up = function (knex) {
  return knex.schema.createTable('session', (table) => {
    // Incremental id
    table.increments();
    table.integer('place_id');
    table.time('session_time');
    table.string('client');
    table.integer('bytes_in');
    table.integer('bytes_out');
    table.integer('session_id');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('session');
};
