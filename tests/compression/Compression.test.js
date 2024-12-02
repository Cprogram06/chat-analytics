"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Compression_1 = require("@pipeline/compression/Compression");
const index_1 = require("@pipeline/index");
const samples_1 = require("@tests/samples");
test("should compress and decompress correctly", async () => {
    const samples = await (0, samples_1.loadSamples)(["discord/GC_3A_5M.json", "discord/SV_5A_5M.json"]);
    const db = await (0, index_1.generateDatabase)(samples.map((s) => s.input), { platform: "discord" }, samples_1.TestEnv);
    const str = (0, Compression_1.compressDatabase)(db);
    const final = (0, Compression_1.decompressDatabase)(str);
    expect(final).toEqual(db);
});
