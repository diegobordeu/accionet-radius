
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    // Incremental id
    table.increments();
    table.string('user_name');
    table.string('password');
    table.string('permissions');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
