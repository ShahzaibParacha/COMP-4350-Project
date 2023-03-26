from keybert import KeyBERT
import sys
import json

# def extract_keywords(kw_model, content):
#     keywords = kw_model.extract_keywords(content)
#     return keywords

if __name__ == '__main__':
    args = sys.argv
    kw_model = KeyBERT()#model='paraphrase-albert-small-v2') ##small model to try
    keywords = kw_model.extract_keywords( kw_model, args[1])
    result = list(dict(keywords).keys())
    if len(result) > 5:
        result = result[:5]
    print(json.dumps(result))
    sys.exit(0)