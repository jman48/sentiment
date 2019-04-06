const table = "reviews";
const column = "source";

exports.up = knex => {
  return knex.schema.table(table, t => {
    t.text(column);
  })
};

exports.down = knex => {
  return knex.schema.table(table, t => {
    t.dropColumn(column);
  });
};
