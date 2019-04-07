import language from '@google-cloud/language';
import makeDebug from "debug";

const languageClient = new language.LanguageServiceClient();

const debug = makeDebug("sentiment:sentiment/index.js");

export function analyseSentiment(text) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT'
  };

  return languageClient.analyzeSentiment({
    document
  }).catch(error => {
    debug('An error has occurred getting the sentiment for some text: ', error);
    return Promise.reject(error);
  }); // This will sometimes reject when text is in a language google can not understand
}