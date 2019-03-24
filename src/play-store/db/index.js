import { map, isNil, isEmpty } from "ramda";
import emojiStrip from 'emoji-strip';
import db from "../../db";

function stripeEmoji(text) {
  if (isNil(text) || isEmpty(text)) return text;

  return emojiStrip(text);
}

async function saveReview({
  id: reviewId,
  userName,
  date,
  url,
  score,
  title,
  text,
  replyDate,
  replyText
}) {
  const dateObj = new Date(date);
  const replyDateObj = new Date(replyDate);

  return db("reviews").insert({
    reviewId,
    userName,
    date: dateObj,
    url,
    score,
    title: stripeEmoji(title),
    text: stripeEmoji(text),
    replyDate: replyDateObj,
    replyText: stripeEmoji(replyText)
  });
}

export async function save(review) {
  try {
    await saveReview(review);
  } catch (error) {
    console.log("Error: ", error);
  }
}
