import playStore from "google-play-scraper";
import makeDebug from "debug";
import { map } from "ramda";
import { analyseSentiment } from "../sentiment";
import { shouldNotify, notify } from "../notification";
import { save } from "./db";
import { PLAY_STORE } from "../core";
import { updateLastReviewId } from "../review";

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
  if (shouldNotify(review, sentiment)) notify(review, sentiment);
}

export async function checkReviews(id) {
  try {
    const reviews = await getReviews(id);
    debug(`Retrieved ${reviews.length} play store reviews`);

    const processReviews = map(review => processReview(review), reviews);
    await Promise.all(processReviews);
    await updateLastReviewId(reviews[0].id, PLAY_STORE);
  } catch (error) {
    debug(error);
  }
}
