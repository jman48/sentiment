import "babel-polyfill";
import { config as loadEnv } from "dotenv";
import { processUsers } from "./users";

loadEnv();

async function run() {
  await processUsers();
  process.exit();
}

(async () => {
  await run();
})();
