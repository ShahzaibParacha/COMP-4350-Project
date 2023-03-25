const MonkeyLearn = require('monkeylearn');
require('dotenv').config();

const apiKey = process.env.MONKEY_API_KEY
//console.log(apiKey)
// Set up the MonkeyLearn API client with your API key
//the key need to be updated if request time pass 1000
const monkeyLearn = new MonkeyLearn('6faaec80b3e6dc09ba32df55f633edb398758393');
const keywordsModel = 'ex_YCya9nrn'

// Define the text to extract keywords from
//const text = 'The romance movie is really touching. It is about a love story in France 300 years ago.'// 'I am looking for a new laptop. I need something that is fast and has a long battery life.';

async function extractKeywords(content){
    try {
        const response = await monkeyLearn.extractors.extract(keywordsModel, [content]);
        const keywords = response.body[0].extractions.map(extraction => extraction.parsed_value);
        return keywords;
      } catch (err) {
        console.log(err);
        return null;
      }
}

module.exports = {extractKeywords}


