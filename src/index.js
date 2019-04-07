import "babel-polyfill";
import { config as loadEnv } from "dotenv";
import { checkReviews as checkPlayStoreReviews } from "./play-store";
import { checkReviews as checkAppStoreReviews } from "./app-store";

loadEnv();

async function run() {
  await Promise.all([
    checkPlayStoreReviews("com.brainfm.app"),
    checkAppStoreReviews("1110684238")
  ]);
}

(async () => {
  await run();
})();
