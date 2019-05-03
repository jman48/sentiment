const table = "reviews";

exports.up = knex => {
  return knex.schema.createTable(table, t => {
    t.increments("id")
      .unsigned()
      .primary()
      .notNullable();
    t.string("reviewId").index(); //Store separate to id as we get reviews from multiple sources, so may conflict if we use it for primary key
    t.integer("source")
      .unsigned()
      .index()
      .references("sources.id");
    t.string("userName");
    t.date("date");
    t.text("url");
    t.text("title");
    t.text("text");
    t.date("replyDate");
    t.text("replyText");
  });
};

exports.down = knex => {
  return knex.schema.dropTable(table);
};
