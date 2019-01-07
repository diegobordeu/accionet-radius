exports.up = function (knex) {
  return knex.schema.createTable('router_stats', (table) => {
    // Incremental id
    table.increments();
    table.integer('place_id');
    table.integer('cpu_usage');
    table.integer('free_memory');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('router_stats');
};
