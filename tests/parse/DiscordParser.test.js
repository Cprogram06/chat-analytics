"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordParser_1 = require("@pipeline/parse/parsers/DiscordParser");
const Parse_1 = require("@tests/parse/Parse");
it("should crash if the guild information is not present before the channel", async () => {
    await expect((0, Parse_1.runParserFromString)(DiscordParser_1.DiscordParser, [`{ "channel": {} }`])).rejects.toThrow("Missing guild ID");
});
it("should crash if the channel information is not present before messages", async () => {
    await expect((0, Parse_1.runParserFromString)(DiscordParser_1.DiscordParser, [
        `
    { 
        "guild": {
            "id": "0",
            "name": "Direct Messages",
            "iconUrl": "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        "messages": [{},{},{}]
    }`,
    ])).rejects.toThrow("Missing channel ID");
});
