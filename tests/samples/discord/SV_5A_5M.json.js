"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedDatabase = exports.expectedParse = void 0;
const Attachments_1 = require("@pipeline/Attachments");
const Languages_1 = require("@pipeline/Languages");
const Common_1 = require("@tests/samples/discord/Common");
exports.expectedParse = {
    guilds: [
        {
            id: "253601524398293010",
            name: "DefleMask",
            avatar: "https://cdn.discordapp.com/icons/253601524398293010/a_801de7dbf6c4b24d8c2c0b576c36150a.png",
        },
    ],
    channels: [
        {
            id: "253601524398293010",
            type: "text",
            name: "general-chiptune",
        },
    ],
    authors: [Common_1.PAUTHOR_DELETED, Common_1.PAUTHOR_MLOMB],
    messages: [
        {
            id: "459136077417021488",
            channelId: "253601524398293010",
            textContent: "This message has been edited and written by a deleted user.",
            authorId: Common_1.PAUTHOR_DELETED.id,
            timestamp: Date.parse("2018-05-20T16:09:44.209+00:00"),
            timestampEdit: Date.parse("2018-05-20T16:09:56.439+00:00"),
        },
        {
            id: "447793085255123004",
            channelId: "253601524398293010",
            textContent: "The author of this message does not have the nickname property, and should fallback to use name.",
            authorId: Common_1.PAUTHOR_MLOMB.id,
            timestamp: Date.parse("2018-05-20T16:09:51.118+00:00"),
        },
        {
            id: "447793085255123005",
            channelId: "253601524398293010",
            authorId: Common_1.PAUTHOR_MLOMB.id,
            textContent: "This message has attachments and stickers.",
            timestamp: Date.parse("2018-05-20T16:09:51.118+00:00"),
            attachments: expect.arrayContaining([Attachments_1.AttachmentType.Image, Attachments_1.AttachmentType.Sticker]),
        },
        {
            id: "447793085255123006",
            channelId: "253601524398293010",
            authorId: Common_1.PAUTHOR_MLOMB.id,
            textContent: "This message has reactions.",
            timestamp: Date.parse("2018-05-20T16:09:51.118+00:00"),
            reactions: expect.arrayContaining([
                [{ text: "❤" }, 2],
                [{ id: "464662216386412545", text: "paul" }, 3],
            ]),
        },
    ],
};
exports.expectedDatabase = {
    minDate: "2018-5-20",
    maxDate: "2018-5-20",
    langs: ["en"],
    guild: {
        name: "DefleMask",
        avatar: "https://cdn.discordapp.com/icons/253601524398293010/a_801de7dbf6c4b24d8c2c0b576c36150a.png",
    },
    channel: {
        name: "general-chiptune",
        type: "text",
        msgCount: 5,
    },
    authors: [Common_1.AUTHOR_MLOMB, Common_1.AUTHOR_DELETED],
    messages: [
        {
            // dateKey: "2018-5-20",
            // secondOfDay: 16 * 3600 + 9 * 60 + 44,
            authorName: Common_1.AUTHOR_DELETED.n,
            langIndex: (0, Languages_1.getLanguageIndexByCode)("en"),
            words: [
                // stopwords: This has been and by a
                ["message", 1],
                ["edited", 1],
                ["written", 1],
                ["deleted", 1],
                ["user", 1],
            ],
        },
        {
            authorName: Common_1.AUTHOR_MLOMB.n,
            langIndex: (0, Languages_1.getLanguageIndexByCode)("en"),
            words: [
                // stopwords: The of this does not have and should use name
                ["author", 1],
                ["message", 1],
                ["nickname", 1],
                ["property", 1],
                ["fallback", 1],
            ],
        },
        {
            authorName: Common_1.AUTHOR_MLOMB.n,
            langIndex: (0, Languages_1.getLanguageIndexByCode)("en"),
            words: [
                // stopwords: This has and
                ["message", 1],
                ["attachments", 1],
                ["stickers", 1],
            ],
            attachments: [
                [Attachments_1.AttachmentType.Image, 1],
                [Attachments_1.AttachmentType.Sticker, 1],
            ],
        },
        {
            authorName: Common_1.AUTHOR_MLOMB.n,
            langIndex: (0, Languages_1.getLanguageIndexByCode)("en"),
            words: [
                // stopwords: This has
                ["message", 1],
                ["reactions", 1],
            ],
            reactions: [
                ["❤", 2],
                ["paul", 3],
            ],
        },
    ],
};
