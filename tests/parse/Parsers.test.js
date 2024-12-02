"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("@pipeline/parse");
const File_1 = require("@pipeline/parse/File");
const DiscordParser_1 = require("@pipeline/parse/parsers/DiscordParser");
const MessengerParser_1 = require("@pipeline/parse/parsers/MessengerParser");
const TelegramParser_1 = require("@pipeline/parse/parsers/TelegramParser");
const WhatsAppParser_1 = require("@pipeline/parse/parsers/WhatsAppParser");
const Parse_1 = require("@tests/parse/Parse");
const samples_1 = require("@tests/samples");
describe("should parse correctly", () => {
    // prettier-ignore
    const cases = [
        { parser: DiscordParser_1.DiscordParser, inputs: ["discord/DM_2A_2M.json"] },
        { parser: DiscordParser_1.DiscordParser, inputs: ["discord/GC_3A_5M.json"] },
        { parser: DiscordParser_1.DiscordParser, inputs: ["discord/SV_5A_5M.json"] },
        { parser: DiscordParser_1.DiscordParser, inputs: ["discord/DM_2A_2M.json", "discord/GC_3A_5M.json", "discord/SV_5A_5M.json"] },
        { parser: WhatsAppParser_1.WhatsAppParser, inputs: ["whatsapp/2A_5M.txt"] },
        { parser: WhatsAppParser_1.WhatsAppParser, inputs: ["whatsapp/4A_11M.txt"] },
        { parser: WhatsAppParser_1.WhatsAppParser, inputs: ["whatsapp/4A_11M.zip"] },
        { parser: TelegramParser_1.TelegramParser, inputs: ["telegram/DM_2A_7M.json"] },
        { parser: MessengerParser_1.MessengerParser, inputs: ["messenger/2A_7M.json"] },
        // TODO: add more, cover branches
        // Telegram and Messenger need more samples
    ];
    test.each(cases)("$inputs", async ({ parser, inputs }) => await (0, Parse_1.checkSamplesAreParsedCorrectly)(parser, inputs));
});
describe("createParser should return the correct parser", () => {
    test.each([
        ["discord", DiscordParser_1.DiscordParser],
        ["whatsapp", WhatsAppParser_1.WhatsAppParser],
        ["telegram", TelegramParser_1.TelegramParser],
        ["messenger", MessengerParser_1.MessengerParser],
    ])("%s", async (platform, expectedClass) => {
        expect((0, parse_1.createParser)(platform)).toBeInstanceOf(expectedClass);
    });
});
describe("timestamp of the last message at the end of the file", () => {
    // prettier-ignore
    const cases = [
        { file: "discord/DM_2A_2M.json", regex: DiscordParser_1.DiscordParser.TS_MSG_REGEX, lastMessageTimestamp: new Date("2019-01-25T00:11:04.083+00:00").getTime() },
        { file: "discord/GC_3A_5M.json", regex: DiscordParser_1.DiscordParser.TS_MSG_REGEX, lastMessageTimestamp: new Date("2023-01-18T20:12:12.123+00:00").getTime() },
        { file: "discord/SV_5A_5M.json", regex: DiscordParser_1.DiscordParser.TS_MSG_REGEX, lastMessageTimestamp: new Date("2018-05-20T16:09:51.118+00:00").getTime() },
        { file: "telegram/DM_2A_7M.json", regex: TelegramParser_1.TelegramParser.TS_MSG_REGEX, lastMessageTimestamp: 1654898799 },
    ];
    test.each(cases)("$file", async ({ file, regex, lastMessageTimestamp }) => {
        const ts = await (0, File_1.tryToFindTimestampAtEnd)(regex, (await (0, samples_1.loadSample)(file)).input);
        expect(ts).toBe(lastMessageTimestamp);
    });
    test("should return undefined if no timestamp is found", async () => {
        const ts = await (0, File_1.tryToFindTimestampAtEnd)(DiscordParser_1.DiscordParser.TS_MSG_REGEX, (0, File_1.wrapStringAsFile)("hello world"));
        expect(ts).toBeUndefined();
    });
});
