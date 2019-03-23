import "babel-polyfill";
import { config as loadEnv } from 'dotenv';
import { checkReviews as checkPlayStoreReviews } from "./play-store";

loadEnv();

module.exports.hello = async (event, context) => {
  await checkPlayStoreReviews('com.brainfm.app');
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
