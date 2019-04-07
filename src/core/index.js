import emojiStrip from "emoji-strip";
import { isEmpty, isNil } from "ramda";
import db from "../db";

/**
 * Strip any emojis from text
 */
export function stripEmoji(text) {
  if (isNil(text) || isEmpty(text)) return text;

  return emojiStrip(text);
}

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

export const APP_STORE = "APP_STORE";
export const PLAY_STORE = "PLAY_STORE";
