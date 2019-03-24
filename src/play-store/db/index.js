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

async function saveSentiment(sentiment, reviewId) {
  const {
    sentences,
    documentSentiment: { magnitude, score },
    language
  } = sentiment[0];

  const sentimentId = await db("sentiment").insert({
    reviewId,
    score,
    magnitude,
    language
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
