import language from '@google-cloud/language';

const languageClient = new language.LanguageServiceClient();


export function analyseSentiment(text) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT'
  };

  return languageClient.analyzeSentiment({
    document
  }).catch((e) => {
    console.log('ERROR: ', e);
    return Promise.reject(e);
  }); // This will sometimes reject when text is in a language google can not understand
}