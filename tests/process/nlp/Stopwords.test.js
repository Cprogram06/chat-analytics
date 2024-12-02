"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stopwords_1 = require("@pipeline/process/nlp/Stopwords");
const samples_1 = require("@tests/samples");
describe("Stopwords", () => {
    let stopwords;
    beforeAll(async () => {
        stopwords = await Stopwords_1.Stopwords.load(samples_1.TestEnv);
    });
    it("should match common stopwords", async () => {
        expect(stopwords.isStopword("the", ["en"])).toBeTrue();
        expect(stopwords.isStopword("la", ["es"])).toBeTrue();
        expect(stopwords.isStopword("boogie", ["en"])).toBeFalse();
        expect(stopwords.isStopword("calamar", ["es"])).toBeFalse();
    });
});
