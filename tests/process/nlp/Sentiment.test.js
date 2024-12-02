"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Languages_1 = require("@pipeline/Languages");
const Emojis_1 = require("@pipeline/process/nlp/Emojis");
const Sentiment_1 = require("@pipeline/process/nlp/Sentiment");
const Tokenizer_1 = require("@pipeline/process/nlp/Tokenizer");
const samples_1 = require("@tests/samples");
describe("Sentiment", () => {
    let sentiment;
    beforeAll(async () => {
        sentiment = await Sentiment_1.Sentiment.load(samples_1.TestEnv, await Emojis_1.Emojis.load(samples_1.TestEnv));
    });
    it("should detect sentiment in basic sentences", () => {
        expect(sentiment.calculate((0, Tokenizer_1.tokenize)("i love you"), Languages_1.LanguageCodes.indexOf("en"))).toBePositive();
        expect(sentiment.calculate((0, Tokenizer_1.tokenize)("i hate you"), Languages_1.LanguageCodes.indexOf("en"))).toBeNegative();
    });
});
