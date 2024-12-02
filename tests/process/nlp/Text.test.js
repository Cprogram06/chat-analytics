"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Text_1 = require("@pipeline/process/nlp/Text");
describe("normalizeText", () => {
    it("should remove unwanted whitespace", () => {
        expect((0, Text_1.normalizeText)("  Hello,    World!123 \t 123  ")).toEqual("Hello, World!123 123");
    });
    it("should remove the variant form 0xFE0F from emojis", () => {
        const unwanted = "☁️";
        const wanted = "☁";
        expect(unwanted).toHaveLength(2);
        expect(unwanted.charCodeAt(1)).toEqual(0xfe0f);
        expect(wanted).toHaveLength(1);
        expect((0, Text_1.normalizeText)(unwanted)).toEqual(wanted);
    });
    it("should remove the variant form 0xFE0E from emojis", () => {
        const unwanted = "📧︎";
        const wanted = "📧";
        expect(unwanted).toHaveLength(3);
        expect(unwanted.charCodeAt(2)).toEqual(0xfe0e);
        expect(wanted).toHaveLength(2);
        expect((0, Text_1.normalizeText)(unwanted)).toEqual(wanted);
    });
});
describe("stripDiacriticsAndSymbols", () => {
    it("should remove diacritics", () => {
        expect((0, Text_1.stripDiacriticsAndSymbols)("áéíóú")).toEqual("aeiou");
    });
    it("should remove symbols", () => {
        expect((0, Text_1.stripDiacriticsAndSymbols)("ⒶⒺⒾⓄⓊ")).toEqual("AEIOU");
        expect((0, Text_1.stripDiacriticsAndSymbols)("ⓐⓔⓘⓞⓤ")).toEqual("aeiou");
    });
});
describe("matchFormat", () => {
    it("should be case insensitive", () => {
        expect((0, Text_1.matchFormat)("HeLlO")).toEqual("hello");
        expect((0, Text_1.matchFormat)("ÁaÉeÍiÓoÚu")).toEqual("aaeeiioouu");
    });
    it("should format weird symbols correctly", () => {
        // weird channel names people may use
        expect((0, Text_1.matchFormat)("𝔤𝔢𝔫𝔢𝔯𝔞𝔩")).toEqual("general");
        expect((0, Text_1.matchFormat)("𝔾𝔼ℕ𝔼ℝ𝔸𝕃")).toEqual("general");
        expect((0, Text_1.matchFormat)("ⒼⒺⓃⒺⓇⒶⓁ")).toEqual("general");
        expect((0, Text_1.matchFormat)("ģe𝕟𝑒ℝＡĻ")).toEqual("general");
        expect((0, Text_1.matchFormat)("𝓖𝓔𝓝𝓔𝓡𝓐𝓛")).toEqual("general");
    });
});
