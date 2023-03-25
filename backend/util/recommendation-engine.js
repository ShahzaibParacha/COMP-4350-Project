

const MonkeyLearn = require('monkeylearn');
require('dotenv').config();

const apiKey = process.env.MONKEY_API_KEY
console.log(apiKey)
// Set up the MonkeyLearn API client with your API key
const monkeyLearn = new MonkeyLearn('6faaec80b3e6dc09ba32df55f633edb398758393');
const keywordsMOdel = 'ex_YCya9nrn'

// Define the text to extract keywords from
const text = 'The romance movie is really touching. It is about a love story in France 300 years ago.'// 'I am looking for a new laptop. I need something that is fast and has a long battery life.';

// Extract keywords from the text using MonkeyLearn's pre-built keyword extraction model
// monkeyLearn.extractors.extract(keywordsMOdel, [text]).then(response => {
//   // Extract the keyword results from the API response
//   const keywords = response.body[0].extractions.map(extraction => extraction.parsed_value);
  
//   // Print the extracted keywords
//   console.log(keywords);
// }).catch(error => {
//   console.log(error);
// });

