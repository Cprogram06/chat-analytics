"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSamplesAreParsedCorrectly = exports.runParserFromString = exports.runParser = void 0;
require("jest-extended");
const File_1 = require("@pipeline/parse/File");
const samples_1 = require("@tests/samples");
/** Convenient function to inspect the objects emitted by a parser for specific inputs */
const runParser = async (klass, inputs) => {
    let parsed = {
        guilds: [],
        channels: [],
        authors: [],
        messages: [],
    };
    let lastMsgTimestamp;
    const parser = new klass();
    parser.on("guild", (guild) => parsed.guilds.push(guild));
    parser.on("channel", (channel) => parsed.channels.push(channel));
    parser.on("author", (author) => parsed.authors.push(author));
    parser.on("message", (message) => {
        parsed.messages.push(message);
        // bonus check
        // check that messages are emitted in chronological order, WHITHIN EACH FILE
        if (lastMsgTimestamp === undefined)
            lastMsgTimestamp = message.timestamp;
        else
            expect(message.timestamp).toBeGreaterThanOrEqual(lastMsgTimestamp);
    });
    for (const input of inputs) {
        // new file, reset
        lastMsgTimestamp = undefined;
        for await (const _ of parser.parse(input))
            continue;
    }
    return parsed;
};
exports.runParser = runParser;
/** Convenient function to inspect the objects emitted by a parser from a string */
const runParserFromString = async (klass, inputs) => (0, exports.runParser)(klass, inputs.map(File_1.wrapStringAsFile));
exports.runParserFromString = runParserFromString;
/** Checks if a group of samples matches the set of expected parse results */
const checkSamplesAreParsedCorrectly = async (klass, filenames) => {
    const samples = await Promise.all(filenames.map((sample) => (0, samples_1.loadSample)(sample)));
    const parsed = await (0, exports.runParser)(klass, samples.map((s) => s.input));
    for (const sample of samples) {
        const expected = sample.expectedParse;
        expect(parsed.guilds).toIncludeAllPartialMembers(expected.guilds);
        expect(parsed.channels).toIncludeAllPartialMembers(expected.channels);
        expect(parsed.authors).toIncludeAllPartialMembers(expected.authors);
        expect(parsed.messages).toIncludeAllPartialMembers(expected.messages);
    }
};
exports.checkSamplesAreParsedCorrectly = checkSamplesAreParsedCorrectly;
