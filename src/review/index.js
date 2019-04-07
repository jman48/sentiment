import db from "../db";

export async function updateLastReviewId(id, source) {
  const row = await db("source_last_id").where({ source });
  const exists = row.length !== 0;

  if (exists) {
    await db("source_last_id")
      .where({ source })
      .update({ last_id: id });
  } else {
    await db("source_last_id").insert({
      source,
      last_id: id
    });
  }
}