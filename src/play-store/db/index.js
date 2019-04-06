import { map, isNil, isEmpty } from "ramda";
import emojiStrip from 'emoji-strip';
import db from "../../db";
import { saveSentiment } from "../../sentiment/db";

/**
 * Strip any emojis from text
 */
function stripEmoji(text) {
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
    title: stripEmoji(title),
    text: stripEmoji(text),
    replyDate: replyDateObj,
    replyText: stripEmoji(replyText)
  });
}

export async function save(review, sentiment) {
  try {
    const [ reviewId ] = await saveReview(review);
    await saveSentiment(sentiment, reviewId)
  } catch (error) {
    console.log("Error: ", error);
  }
}
