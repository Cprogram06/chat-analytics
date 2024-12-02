"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTestDatabase = void 0;
const index_1 = require("@pipeline/index");
const samples_1 = require("@tests/samples");
const loadTestDatabase = async () => {
    const samples = await (0, samples_1.loadSamples)(["telegram/BIG_20A_5475M.json"]);
    const db = await (0, index_1.generateDatabase)(samples.map((s) => s.input), { platform: "telegram" }, samples_1.TestEnv);
    return db;
};
exports.loadTestDatabase = loadTestDatabase;
