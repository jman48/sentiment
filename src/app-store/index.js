import store from "app-store-scraper";
import { map } from "ramda";
import { analyseSentiment } from "../sentiment";
import { save } from "./db";
import makeDebug from "debug";
import { updateLastReviewId, APP_STORE } from "../core";

const debug = makeDebug("sentiment:appstore/index.js");

function getReviews(id) {
  return store.reviews({
    id,
    sort: store.sort.NEWEST,
    page: 1
  });
}

async function processReview(review) {
  const sentiment = await analyseSentiment(review.text);
  await save(review, sentiment);
}

export async function checkReviews(id) {
  try {
    const reviews = await getReviews(id);
    debug(`Retrieved ${reviews.length} app store reviews`);

    const processReviews = map(review => processReview(review), reviews);
    await Promise.all(processReviews);
    await updateLastReviewId(reviews[0].id, APP_STORE);
  } catch (error) {
    debug(error);
  }
}
