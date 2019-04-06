import makeDebug from "debug";
import db from "../../db";
import { saveSentiment } from "../../sentiment/db";
import { stripEmoji } from "../../core";
import { APP_STORE } from "../../core";

const debug = makeDebug("sentiment:appstore/db/index.js");

function saveReview({
  id: reviewId,
  userName,
  url,
  score,
  title,
  text
}) {
  //App store does not include a date for reviews, so just use the time we retrieved the review
  const dateObj = new Date();

  return db("reviews").insert({
    reviewId,
    userName,
    date: dateObj,
    url,
    score,
    title: stripEmoji(title),
    text: stripEmoji(text),
    source: APP_STORE
  })
}

export async function save(review, sentiment) {
  try {
    const [ reviewId ] = await saveReview(review);
    await saveSentiment(sentiment, reviewId)
  } catch (error) {
    debug('Error trying to save app store review and sentiment: ', error);
  }
}
