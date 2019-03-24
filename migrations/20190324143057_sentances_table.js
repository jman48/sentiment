const table = "sentence";

exports.up = knex => {
  return knex.schema.createTable(table, t => {
    t.increments("id")
      .unsigned()
      .primary()
      .notNullable();
    t.integer("sentimentId")
      .unsigned()
      .index()
      .references("sentiment.id");
    t.text("text");
    t.float("score");
    t.float("magnitude");
    t.integer("offset");
    t.string("language");
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
