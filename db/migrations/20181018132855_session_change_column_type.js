
exports.up = function (knex) {
  const promises = [];
  promises.push(knex.schema.raw('ALTER TABLE session ALTER COLUMN bytes_in TYPE FLOAT'));
  promises.push(knex.schema.raw('ALTER TABLE session ALTER COLUMN bytes_out TYPE FLOAT'));
  return Promise.all(promises);
};

exports.down = function (knex) {
  const promises = [];
  promises.push(knex.schema.raw('ALTER TABLE session ALTER COLUMN bytes_in TYPE INT'));
  promises.push(knex.schema.raw('ALTER TABLE session ALTER COLUMN bytes_out TYPE INT'));
  return Promise.all(promises);
};
