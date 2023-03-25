from keybert import KeyBERT
import sys

def extract_keywords(content):
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(content)
    return keywords

if __name__ == '__main__':
    args = sys.argv
    keywords = extract_keywords(args[1])
    result = list(dict(keywords).keys())
    if len(result) > 3:
        result = result[:3]
    print(result)
    sys.exit(0)