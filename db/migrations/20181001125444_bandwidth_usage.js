exports.up = function (knex) {
  return knex.schema.createTable('bandwidth_usage', (table) => {
    // Incremental id
    table.increments();
    table.integer('place_id');
    table.string('type_of');
    table.string('mac_address');
    table.integer('download');
    table.integer('upload');
    table.specificType('extracted_time', 'timestamp');
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('bandwidth_usage');
};
