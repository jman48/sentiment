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
    t.decimal("score", 18, 17);
    t.integer("magnitude");
    t.string("language");
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
