"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopwords = void 0;
const Text_1 = require("@pipeline/process/nlp/Text");
/** Stopwords database */
class Stopwords {
    constructor(stopwords) {
        this.stopwords = stopwords;
        // format all stopwords
        for (const lang in stopwords) {
            stopwords[lang] = stopwords[lang].map((word) => (0, Text_1.matchFormat)(word));
        }
    }
    /** Checks wether a word is a stopword in any of the given languages */
    isStopword(word, langs) {
        const wordFormatted = (0, Text_1.matchFormat)(word);
        for (const lang of langs) {
            if (this.stopwords[lang] && this.stopwords[lang].includes(wordFormatted))
                return true;
        }
        return false;
    }
    static async load(env) {
        return new Stopwords(await env.loadAsset("/data/text/stopwords-iso.json", "json"));
    }
}
exports.Stopwords = Stopwords;
