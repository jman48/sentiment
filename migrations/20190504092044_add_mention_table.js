const table = "mention";

exports.up = knex => {
  return knex.schema.createTable(table, t => {
    t.increments("id")
      .unsigned()
      .primary()
      .notNullable();
    t.integer("entityId")
      .unsigned()
      .index()
      .references("entity.id");
    t.text('text');
    t.decimal("score", 18, 17);
    t.integer("magnitude");
    t.integer("offset");
    t.string('type');
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
