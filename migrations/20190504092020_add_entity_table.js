const table = "entity";

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
    t.text('name');
    t.decimal("salience", 18, 17);
    t.decimal("score", 18, 17);
    t.integer("magnitude");
    t.string('type');
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
