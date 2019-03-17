import playStore from "google-play-scraper";
import makeDebug from 'debug';
import { analyseSentiment } from "../sentiment";
import { shouldNotify, notify } from "../notification";

const debug = makeDebug('sentiment:playstore/index.js');

function getReviews(appId, page = 0) {
  return playStore.reviews({
    appId,
    sort: playStore.sort.NEWEST,
    page
  });
}

async function processReview(review) {
  const sentiment = await analyseSentiment(review.text);

  if (shouldNotify(review, sentiment)) notify(review, sentiment);
}

export async function checkReviews(id) {
  try {
    const reviews = await getReviews(id);
    debug(`Retrieved ${reviews.length} reviews`);

    for (let review of reviews) {
      await processReview(review);
    }
  } catch (error) {
    debug(error);
  }
}
