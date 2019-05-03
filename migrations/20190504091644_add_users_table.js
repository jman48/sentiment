const table = "users";

exports.up = knex => {
  return knex.schema.createTable(table, t => {
    t.increments("id")
      .unsigned()
      .primary()
      .notNullable();
    t.text('email');
    t.boolean('enabled').defaultTo(true);
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
