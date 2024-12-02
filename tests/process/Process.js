"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseIsGeneratedCorrectly = void 0;
const Time_1 = require("@pipeline/Time");
const index_1 = require("@pipeline/index");
const Text_1 = require("@pipeline/process/nlp/Text");
const BitStream_1 = require("@pipeline/serialization/BitStream");
const MessagesArray_1 = require("@pipeline/serialization/MessagesArray");
const samples_1 = require("@tests/samples");
/** Checks if a group of samples matches the set of expected parse results */
const checkDatabaseIsGeneratedCorrectly = async (platform, filenames) => {
    const samples = await (0, samples_1.loadSamples)(filenames);
    const db = await (0, index_1.generateDatabase)(samples.map((s) => s.input), { platform }, samples_1.TestEnv);
    const formattedWords = db.words.map((w) => (0, Text_1.matchFormat)(w));
    const Day_lteq = (a, b) => Time_1.Day.lt(a, b) || Time_1.Day.eq(a, b);
    const Day_gteq = (a, b) => Time_1.Day.gt(a, b) || Time_1.Day.eq(a, b);
    for (const sample of samples) {
        const expected = sample.expectedDatabase;
        expect(Day_lteq(Time_1.Day.fromKey(db.time.minDate), Time_1.Day.fromKey(expected.minDate))).toBeTrue();
        expect(Day_gteq(Time_1.Day.fromKey(db.time.maxDate), Time_1.Day.fromKey(expected.maxDate))).toBeTrue();
        expect(db.langs).toIncludeAllMembers(expected.langs);
        expect(db.guilds).toIncludeAllPartialMembers([expected.guild]);
        expect(db.channels).toIncludeAllPartialMembers([expected.channel]);
        expect(db.authors).toIncludeAllPartialMembers(expected.authors);
        const guildIndex = db.guilds.findIndex((g) => g.name === expected.guild.name);
        const channelIndex = db.channels.findIndex((c) => c.name === expected.channel.name);
        const channel = db.channels[channelIndex];
        expect(channel.guildIndex).toBe(guildIndex);
        const stream = new BitStream_1.BitStream(db.messages.buffer);
        stream.offset = channel.msgAddr || 0;
        const messagesArr = new MessagesArray_1.MessagesArray(db.bitConfig, stream, channel.msgCount);
        const messages = Array.from(messagesArr);
        expect(messages.length).toBeGreaterThanOrEqual(messages.length);
        // const { dateKeys } = genTimeKeys(Day.fromKey(db.time.minDate), Day.fromKey(db.time.maxDate));
        for (const expectedMessage of expected.messages) {
            const toCheck = {
                // dayIndex: dateKeys.indexOf(expectedMessage.dateKey),
                // secondOfDay: expectedMessage.secondOfDay,
                authorIndex: db.authors.findIndex((a) => a.n === expectedMessage.authorName),
                langIndex: expectedMessage.langIndex,
            };
            if (expectedMessage.words) {
                toCheck.words = expect.arrayContaining(expectedMessage.words.map(([w, c]) => [formattedWords.indexOf((0, Text_1.matchFormat)(w)), c]));
            }
            if (expectedMessage.attachments)
                toCheck.attachments = expectedMessage.attachments;
            if (expectedMessage.reactions) {
                toCheck.reactions = expect.arrayContaining(expectedMessage.reactions.map(([name, c]) => [
                    db.emojis.findIndex((r) => r.name === name || (r.type === "unicode" && r.symbol === name)),
                    c,
                ]));
            }
            if (expectedMessage.mentions) {
                toCheck.mentions = expect.arrayContaining(expectedMessage.mentions.map(([m, c]) => [db.mentions.indexOf(m), c]));
            }
            if (expectedMessage.domains) {
                toCheck.domains = expect.arrayContaining(expectedMessage.domains.map(([d, c]) => [db.domains.indexOf(d), c]));
            }
            // TODO: there is a lot more to test...
            expect(messages).toIncludeAllPartialMembers([toCheck]);
        }
    }
};
exports.checkDatabaseIsGeneratedCorrectly = checkDatabaseIsGeneratedCorrectly;
