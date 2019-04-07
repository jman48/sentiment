import playStore from "google-play-scraper";
import makeDebug from "debug";
import { map } from "ramda";
import { analyseSentiment } from "../sentiment";
import { save } from "./db";
import { PLAY_STORE } from "../core";
import { updateLastReviewId, getNewReviews } from "../review";

const debug = makeDebug("sentiment:playstore/index.js");

function getReviews(appId, page = 0) {
  return playStore.reviews({
    appId,
    sort: playStore.sort.NEWEST,
    page
  });
}

async function processReview(review) {
  const sentiment = await analyseSentiment(review.text);
  await save(review, sentiment);
}

export async function processReviews(id) {
  try {
    const reviews = await getReviews(id);
    debug(`Retrieved ${reviews.length} play store reviews`);

    const newReviewsToProcess = await getNewReviews(reviews, PLAY_STORE);
    debug(`${newReviewsToProcess.length} new play store reviews to process`);

    if (newReviewsToProcess.length < 1) return;

    const processReviews = map(review => processReview(review), newReviewsToProcess);
    await Promise.all(processReviews);
    await updateLastReviewId(reviews[0].id, PLAY_STORE);
  } catch (error) {
    debug('An error has occurred processing play store reviews: ', error);
  }
}
