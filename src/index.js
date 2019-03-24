import "babel-polyfill";
import { config as loadEnv } from 'dotenv';
import { checkReviews as checkPlayStoreReviews } from "./play-store";

loadEnv();

async function run() {
  await checkPlayStoreReviews('com.brainfm.app');
}

(async () => {
  await run();
})();
