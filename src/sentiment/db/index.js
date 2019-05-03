import { map, mapObjIndexed } from "ramda";
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

export async function saveEntitySentiment(entitySentiment) {
  const {
    name,
    type,
    salience,
    sentiment: { score, magnitude }
  } = entitySentiment;

  const entityId = await db("entity").insert({
    name,
    type,
    salience,
    score,
    magnitude
  });

  const mentionsInserts = map(
    ({
      text: { content, beginOffset },
      type,
      sentiment: { score, magnitude }
    }) => {
      return db("mention").insert({
        entityId,
        text: content,
        offset: beginOffset,
        score,
        magnitude,
        type
      });
    }
  );

  const metadataInserts = mapObjIndexed((value, key) => {
    return db("metadata").insert({
      entityId,
      key,
      value
    })
  });

  await Promise.all([
    mentionsInserts,
    metadataInserts
  ])
}
