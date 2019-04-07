import db from "../../db";
import { saveSentiment } from "../../sentiment/db";
import { PLAY_STORE, stripEmoji } from "../../core";
import makeDebug from "debug";

const debug = makeDebug("sentiment:playstore/db/index.js");

async function saveReview({
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
    reviewId,
    userName,
    date: dateObj,
    url,
    score,
    title: stripEmoji(title),
    text: stripEmoji(text),
    replyDate: replyDateObj,
    replyText: stripEmoji(replyText),
    source: PLAY_STORE
  });
}

export async function save(review, sentiment) {
  try {
    const [ reviewId ] = await saveReview(review);
    await saveSentiment(sentiment, reviewId)
  } catch (error) {
    debug('An error has occurred trying to save a play store review: ', error);
  }
}
