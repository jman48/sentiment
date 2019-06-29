import db from "../../db";
import { saveSentiment, saveEntitySentiments } from "../../sentiment/db";
import { PLAY_STORE, stripEmoji } from "../../core";
import makeDebug from "debug";

const debug = makeDebug("sentiment:playstore/db/index.js");

async function saveReview({
  sourceId,
  id: reviewId,
  userName,
  date,
  url,
  score,
  title,
  text,
  replyDate,
  replyText
}) {
  const dateObj = new Date(date);
  const replyDateObj = new Date(replyDate);

  return db("reviews").insert({
    source: sourceId,
    reviewId,
    userName,
    date: dateObj,
    url,
    score,
    title: stripEmoji(title),
    text: stripEmoji(text),
    replyDate: replyDateObj,
    replyText: stripEmoji(replyText)
  });
}

export async function save(review, sentiment, entitySentiment, sourceId) {
  try {
    const [reviewId] = await saveReview({ ...review, sourceId });
    await saveSentiment(sentiment, reviewId);
    await saveEntitySentiments(entitySentiment[0].entities, reviewId);
  } catch (error) {
    debug("An error has occurred trying to save a play store review: ", error);
  }
}
