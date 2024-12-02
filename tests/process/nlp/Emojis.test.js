"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emojis_1 = require("@pipeline/process/nlp/Emojis");
const samples_1 = require("@tests/samples");
describe("Emojis", () => {
    let emojis;
    beforeAll(async () => {
        emojis = await Emojis_1.Emojis.load(samples_1.TestEnv);
    });
    it("should have the name of common emojis", async () => {
        expect(emojis.getName("😀")).toBe("grinning face");
        expect(emojis.getName("💚")).toBe("green heart");
    });
    it("should return correct sentiment for common emojis", async () => {
        expect(emojis.getSentiment("😡")).toBeNegative();
        expect(emojis.getSentiment("❤")).toBePositive();
        expect(emojis.getSentiment("🟪")).toBe(0); // rare emoji
    });
});
