"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@lib/index");
const Compression_1 = require("@pipeline/compression/Compression");
const MessageSerialization_1 = require("@pipeline/serialization/MessageSerialization");
const samples_1 = require("@tests/samples");
test("report should contain data and title", async () => {
    const db = {
        config: {
            platform: "discord",
        },
        generatedAt: "2023-02-14T00:36:19.676Z",
        title: "This is the report title that should end up in the title of the report HTML",
        langs: ["en"],
        time: {
            minDate: "2020-01-01",
            maxDate: "2020-01-01",
            numDays: 1,
            numMonths: 1,
            numYears: 1,
        },
        guilds: [],
        channels: [],
        authors: [],
        emojis: [],
        words: [],
        mentions: [],
        domains: [],
        messages: new Uint8Array(256),
        numMessages: 12,
        bitConfig: MessageSerialization_1.DefaultMessageBitConfig,
    };
    const report = await (0, index_1.generateReport)(db, samples_1.TestEnv);
    expect(report.html).toContain('<div id="app">');
    expect(report.html).toMatch(new RegExp(`<title>${db.title}`, "g"));
    expect(report.data).toEqual((0, Compression_1.compressDatabase)(db));
});
