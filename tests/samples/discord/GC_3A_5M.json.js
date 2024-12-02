"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedDatabase = exports.expectedParse = void 0;
const Languages_1 = require("@pipeline/Languages");
const Common_1 = require("@tests/samples/discord/Common");
exports.expectedParse = {
    guilds: [Common_1.PGUILD_DM],
    channels: [
        {
            id: "1064990764406419508",
            guildId: "0",
            type: "group",
            name: "a group chat",
            avatar: "253913584806",
        },
    ],
    authors: [Common_1.PAUTHOR_MLOMB, Common_1.PAUTHOR_THEPLANT, Common_1.PAUTHOR_LOMBI],
    messages: [
        {
            id: "1064990824305274930",
            channelId: "1064990764406419508",
            textContent: "Should honor nickname over name",
            authorId: Common_1.PAUTHOR_THEPLANT.id,
            timestamp: Date.parse("2023-01-17T19:33:19.087+00:00"),
        },
        {
            id: "1064991070322180096",
            channelId: "1064990764406419508",
            textContent: "hey @mlomb whats up, check out https://chatanalytics.app",
            authorId: Common_1.PAUTHOR_LOMBI.id,
            timestamp: Date.parse("2023-01-17T19:34:17.742+00:00"),
        },
        {
            id: "530805779645595660",
            channelId: "1064990764406419508",
            textContent: "woah nice :custom_emoji:",
            authorId: Common_1.PAUTHOR_MLOMB.id,
            timestamp: Date.parse("2023-01-18T20:12:12.123+00:00"),
            replyTo: "1064990824305274930",
        },
    ],
};
exports.expectedDatabase = {
    minDate: "2023-01-17",
    maxDate: "2023-01-18",
    langs: ["en"],
    guild: { name: Common_1.PGUILD_DM.name },
    channel: {
        name: "a group chat",
        type: "group",
        avatar: "253913584806",
    },
    authors: [Common_1.AUTHOR_THEPLANT, Common_1.AUTHOR_LOMBI, Common_1.AUTHOR_MLOMB],
    messages: [
        {
            authorName: Common_1.AUTHOR_THEPLANT.n,
            langIndex: (0, Languages_1.getLanguageIndexByCode)("en"),
            words: [
                // stopwords: should over name
                ["honor", 1],
                ["nickname", 1],
            ],
        },
        {
            authorName: Common_1.AUTHOR_LOMBI.n,
            langIndex: (0, Languages_1.getLanguageIndexByCode)("en"),
            words: [
                // stopwords: whats up out
                ["hey", 1],
                ["check", 1],
            ],
            mentions: [["mlomb", 1]],
            domains: [["chatanalytics.app", 1]],
        },
        {
            authorName: Common_1.AUTHOR_MLOMB.n,
            langIndex: (0, Languages_1.getLanguageIndexByCode)("en"),
            words: [
                ["woah", 1],
                ["nice", 1],
            ],
            // TODO: test custom_emoji
        },
    ],
};
