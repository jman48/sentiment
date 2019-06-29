/**
 * A source is an place to get reviews from. Currently this is either the App store or Google play store
 */
import { isNil, map } from "ramda";
import makeDebug from "debug";
import { APP_STORE, PLAY_STORE } from "../core";
import db from "../db";
import { processReviews as processAppStoreReviews } from "../app-store";
import { processReviews as processPlayStoreReviews } from "../play-store";

const debug = makeDebug("sentiment:source/index.js");

function processSource({ id, sourceId, sourceType }) {
  switch (sourceType) {
    case APP_STORE:
      return processAppStoreReviews(id, sourceId);
    case PLAY_STORE:
      return processPlayStoreReviews(id, sourceId);
  }
}

export async function processSources(userId) {
  try {
    const sources = await db("sources").where({ userId });

    if (isNil(sources) || sources.length < 1) return;

    debug(`Processing ${sources.length} sources for user with id of ${userId}`);

    const sourcesProcessPromise = map(source => processSource(source), sources);
    await Promise.all(sourcesProcessPromise);
  } catch (error) {
    debug(`An error has occurred processing sources for user ${userId}: `, error);
  }
}
