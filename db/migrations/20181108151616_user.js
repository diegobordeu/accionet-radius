
exports.up = function (knex) {
  return knex.schema.createTable('user', (table) => {
    // Incremental id
    table.increments();
    table.string('username');
    table.text('password');
    table.string('role');
    table.boolean('is_active');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user');
};
