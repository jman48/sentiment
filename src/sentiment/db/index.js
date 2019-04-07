import { map } from "ramda";
import { stripEmoji } from "../../core";
import db from "../../db";

export async function saveSentiment(sentiment, reviewId) {
  const {
    sentences,
    documentSentiment: { magnitude, score },
    language
  } = sentiment[0];

  const sentimentId = await db("sentiment").insert({
    reviewRowId: reviewId,
    score,
    magnitude,
    language
  });

  const sentencesDb = map(
    ({ text: { content, beginOffset }, sentiment: { score, magnitude } }) => {
      return {
        sentimentId,
        text: stripEmoji(content),
        offset: beginOffset,
        score,
        magnitude
      };
    },
    sentences
  );
  await db("sentence").insert(sentencesDb);
}
