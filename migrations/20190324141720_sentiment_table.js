const table = "sentiment";

exports.up = knex => {
  return knex.schema.createTable(table, t => {
    t.increments("id")
      .unsigned()
      .primary()
      .notNullable();
    t.integer("reviewRowId")
      .unsigned()
      .index()
      .references("reviews.id");
    t.float("score");
    t.float("magnitude");
    t.string("language");
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
