
exports.up = function (knex) {
  return knex.schema.createTable('subscription', (table) => {
    // Incremental id
    table.increments();
    table.string('mac_address');
    table.string('profile_id');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('subscription');
};
