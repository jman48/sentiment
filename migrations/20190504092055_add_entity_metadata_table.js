const table = "entity_metadata";

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
    t.text('value');
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
