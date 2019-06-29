import language from "@google-cloud/language";
import makeDebug from "debug";

const languageClient = new language.LanguageServiceClient();

const debug = makeDebug("sentiment:sentiment/index.js");

export function analyseSentiment(text) {
  const document = {
    content: text,
    type: "PLAIN_TEXT"
  };

  return languageClient.analyzeSentiment({
    document
  });
}

export function analyseEntitySentiment(text) {
  const document = {
    content: text,
    type: "PLAIN_TEXT"
  };

  return languageClient.analyzeEntitySentiment({
    document
  });
}
