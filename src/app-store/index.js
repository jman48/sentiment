import store from "app-store-scraper";
import { map } from "ramda";
import { analyseSentiment } from "../sentiment";
import { save } from "./db";
import makeDebug from "debug";
import { APP_STORE } from "../core";
import { getNewReviews, updateLastReviewId } from "../review";

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

    const newReviewsToProcess = await getNewReviews(reviews, APP_STORE);
    debug(`${newReviewsToProcess.length} new app store reviews to process`);

    if (newReviewsToProcess.length < 1) return;

    const processReviews = map(review => processReview(review), reviews);
    await Promise.all(processReviews);
    await updateLastReviewId(reviews[0].id, APP_STORE);
  } catch (error) {
    debug(error);
  }
}
