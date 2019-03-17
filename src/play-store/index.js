import playStore from "google-play-scraper";
import { analyseSentiment } from "../sentiment";
import { shouldNotify, notify } from "../notification";

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

    for (let review of reviews) {
      await processReview(review);
    }
  } catch (error) {
    console.log('Error: ', error);
  }
}
