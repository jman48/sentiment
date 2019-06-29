import store from "app-store-scraper";
import { map } from "ramda";
import { analyseSentiment } from "../sentiment";
import { save } from "./db";
import makeDebug from "debug";
import { APP_STORE, filterErrors } from "../core";
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

export async function processReviews(id) {
  try {
    const reviews = await getReviews(id);
    debug(`Retrieved ${reviews.length} app store reviews`);

    if (reviews.length < 1) return;

    const newReviewsToProcess = await getNewReviews(reviews, APP_STORE);
    debug(`${newReviewsToProcess.length} new app store reviews to process`);

    if (newReviewsToProcess.length < 1) return;

    const processReviews = map(
      review => processReview(review),
      newReviewsToProcess
    );

    // Filter out any translation errors
    await Promise.all(
      processReviews.map(promise => promise.catch(error => filterErrors(error)))
    );
    await updateLastReviewId(reviews[0].id, APP_STORE);
  } catch (error) {
    debug("An error has occurred processing app store reviews: ", error);
  }
}
