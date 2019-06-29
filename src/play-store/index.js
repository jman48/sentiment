import playStore from "google-play-scraper";
import makeDebug from "debug";
import { map } from "ramda";
import { analyseSentiment, analyseEntitySentiment } from "../sentiment";
import { save } from "./db";
import { PLAY_STORE, filterErrors } from "../core";
import { updateLastReviewId, getNewReviews } from "../review";

const debug = makeDebug("sentiment:playstore/index.js");

function getReviews(appId, page = 8) {
  return playStore.reviews({
    appId,
    sort: playStore.sort.NEWEST,
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
    debug(`Retrieved ${reviews.length} play store reviews`);

    if (reviews.length < 1)
      return debug("No reviews to process for source: ", sourceId);

    const newReviewsToProcess = await getNewReviews(reviews, PLAY_STORE);
    debug(`${newReviewsToProcess.length} new play store reviews to process`);

    if (newReviewsToProcess.length < 1) return;

    const processReviews = map(
      review => processReview(review, sourceId),
      newReviewsToProcess
    );

    // Filter out any translation errors
    await Promise.all(
      processReviews.map(promise => promise.catch(error => filterErrors(error)))
    );
    await updateLastReviewId(reviews[0].id, PLAY_STORE);
  } catch (error) {
    debug("An error has occurred processing play store reviews: ", error);
  }
}
