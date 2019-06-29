import emojiStrip from "emoji-strip";
import { isEmpty, isNil } from "ramda";
import makeDebug from "debug";

const debug = makeDebug("sentiment:core/index.js");

/**
 * Strip any emojis from text
 */
export function stripEmoji(text) {
  if (isNil(text) || isEmpty(text)) return text;

  return emojiStrip(text);
}

const isTranslationError = error => error.code === 3;

// Return only errors we care about
export const filterErrors = error => {
  if (isTranslationError(error)) {
    debug("Ignoring a translation error...");
    return;
  }

  return error;
};

export const APP_STORE = "APP_STORE";
export const PLAY_STORE = "PLAY_STORE";
