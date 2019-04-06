import emojiStrip from "emoji-strip";
import { isEmpty, isNil } from "ramda";

/**
 * Strip any emojis from text
 */
export function stripEmoji(text) {
  if (isNil(text) || isEmpty(text)) return text;

  return emojiStrip(text);
}

export const APP_STORE = 'APP_STORE';
export const PLAY_STORE = 'PLAY_STORE';