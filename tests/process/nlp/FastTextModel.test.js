"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FastTextModel_1 = require("@pipeline/process/nlp/FastTextModel");
const samples_1 = require("@tests/samples");
describe("FastTextLID176Model", () => {
    let model;
    beforeAll(async () => {
        model = await FastTextModel_1.FastTextLID176Model.load(samples_1.TestEnv);
    });
    it("should predict common languages correctly", async () => {
        expect(model.identifyLanguage("This text is in english!")).toHaveProperty("iso639", "en");
        expect(model.identifyLanguage("¡Este texto está en español!")).toHaveProperty("iso639", "es");
    });
});
