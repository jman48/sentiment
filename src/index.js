import "babel-polyfill";
import { config as loadEnv } from "dotenv";
import { processReviews as processPlayStoreReviews } from "./play-store";
import { processReviews as processAppStoreReviews } from "./app-store";

loadEnv();

async function run() {
  await Promise.all([
    processPlayStoreReviews("com.brainfm.app"),
    processAppStoreReviews("1110684238")
  ]);
  process.exit();
}

(async () => {
  await run();
})();
