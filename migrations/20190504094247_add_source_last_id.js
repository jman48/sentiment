const table = "source_last_id";

exports.up = knex => {
  return knex.schema.createTable(table, t => {
    t.text("source");
    t.text("last_id");
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
