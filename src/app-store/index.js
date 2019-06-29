import store from "app-store-scraper";
import { map } from "ramda";
import { analyseEntitySentiment, analyseSentiment } from "../sentiment";
import { save } from "./db";
import makeDebug from "debug";
import { APP_STORE, filterErrors } from "../core";
import { getNewReviews, updateLastReviewId } from "../review";

const debug = makeDebug("sentiment:appstore/index.js");

function getReviews(id, page = 0) {
  return store.reviews({
    id,
    sort: store.sort.NEWEST,
    page
  });
}

async function processReview(review, sourceId) {
  const sentiment = await analyseSentiment(review.text);
  const entitySentiment = await analyseEntitySentiment(review.text);
  await save(review, sentiment, entitySentiment, sourceId);
}

export async function processReviews(sourceId, source) {
  try {
    const reviews = await getReviews(source);
    debug(`Retrieved ${reviews.length} app store reviews`);

    if (reviews.length < 1) return debug('No reviews to process from source: ', sourceId);

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
