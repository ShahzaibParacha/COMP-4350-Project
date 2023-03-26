const MonkeyLearn = require('monkeylearn');
require('dotenv').config();

const apiKey = process.env.MONKEY_API_KEY;

// Set up the MonkeyLearn API client with your API key
//the key need to be updated if request time pass 1000
const monkeyLearn = new MonkeyLearn(apiKey);
const keywordsModel = 'ex_YCya9nrn';

async function extractKeywords(content){
    try {
        if (content !== ''){
            const response = await monkeyLearn.extractors.extract(keywordsModel, [content]);
            const keywords = response.body[0].extractions.map(extraction => extraction.parsed_value);
            //console.log(keywords);
            return keywords;
            }else{
                return [];
            }
        } catch (err) {
            console.log("No response from monkeyLearn request, try to renew your monkeyLearn key or fix this problem: " + err);
            return [];
        }
}

module.exports = {extractKeywords};
