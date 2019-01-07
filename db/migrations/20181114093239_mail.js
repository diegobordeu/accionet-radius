
exports.up = function (knex) {
  return knex.schema.createTable('mail', (table) => {
    // Incremental id
    table.increments();
    table.string('address');
    table.boolean('is_active');

    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('mail');
};
