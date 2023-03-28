from keybert import KeyBERT
import sys
import json
from sentence_transformers import SentenceTransformer


def extract_keywords( content):
    #('paraphrase-albert-small-v2') #( 'distilbert-base-nli-stsb-mean-tokens' ) #("all-MiniLM-L6-v2")
    sentence_model = SentenceTransformer( 'distilbert-base-nli-stsb-mean-tokens' ) 
    kw_model = KeyBERT(model=sentence_model)
    keywords = kw_model.extract_keywords(content)
    return keywords

if __name__ == '__main__':
    args = sys.argv
    keywords = extract_keywords( args[1] )
    result = list(dict(keywords).keys())
    if len(result) > 5:
        result = result[:5]
    print(json.dumps(result))
