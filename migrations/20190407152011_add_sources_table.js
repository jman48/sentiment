const table = "sources";

exports.up = knex => {
  return knex.schema.createTable(table, t => {
    t.increments("id")
      .unsigned()
      .primary()
      .notNullable();
    t.integer("userId")
      .unsigned()
      .index()
      .references("reviews.id");
    t.text('sourceName');
    t.text('sourceId');
    t.string('sourceType');
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
