import db from "../db";
import { dropLast, findIndex, isNil } from "ramda";

export async function updateLastReviewId(id, source) {
  const row = await db("source_last_id").where({ source });
  const exists = row.length !== 0;

  if (exists) {
    await db("source_last_id")
      .where({ source })
      .update({ last_id: id });
  } else {
    await db("source_last_id").insert({
      source,
      last_id: id
    });
  }
}

export async function getNewReviews(reviews, source) {
  const lastIdObj = await db("source_last_id").where({
    source
  });

  // No last_id so must be first run
  if (isNil(lastIdObj) || lastIdObj.length < 1) return reviews;

  const [{ last_id }] = lastIdObj;

  const [{ date }] = await db("reviews").where({ reviewId: last_id });

  const lastReviewIndex = findIndex(review => {
    return review.id === last_id;
  }, reviews);

  const lastReviewDate = new Date(date);
  const latestReviewDate = new Date(reviews[0].date);

  // Last review not found and these reviews are newer, so return all
  if (lastReviewIndex === -1 && latestReviewDate >= lastReviewDate) {
    return reviews;
  }
  // Last review not found and these reviews are older, so they must have already been processed
  else if (lastReviewIndex === -1) return [];

  // Found review, so return all the newer ones before it
  const reviewsToDrop = reviews.length - lastReviewIndex;
  return dropLast(reviewsToDrop, reviews);
}
