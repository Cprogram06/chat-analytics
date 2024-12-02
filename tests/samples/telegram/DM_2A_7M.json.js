"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedParse = void 0;
const Attachments_1 = require("@pipeline/Attachments");
const Common_1 = require("@tests/samples/telegram/Common");
exports.expectedParse = {
    guilds: [Common_1.PGUILD_DEFAULT],
    channels: [{ id: 700000000, guildId: 0, type: "dm" }],
    authors: [
        { id: "user300000000", name: "Alice", bot: false },
        { id: "user700000000", name: "Bob", bot: false },
    ],
    messages: [
        {
            id: "3644",
            authorId: "user700000000",
            channelId: 700000000,
            textContent: " https://google.com  👀",
            timestamp: Date.parse("2022-03-09T13:07:32"),
        },
        {
            id: "3645",
            authorId: "user300000000",
            channelId: 700000000,
            textContent: "hello world",
            timestamp: Date.parse("2022-03-09T13:07:42"),
        },
        {
            id: "3662",
            authorId: "user700000000",
            channelId: 700000000,
            textContent: "world?",
            timestamp: Date.parse("2022-05-09T19:23:53"),
        },
        {
            id: "3663",
            authorId: "user300000000",
            channelId: 700000000,
            textContent: "blah blah",
            timestamp: Date.parse("2022-05-09T20:26:09"),
        },
        {
            id: "3672",
            attachments: [Attachments_1.AttachmentType.Image],
            authorId: "user300000000",
            channelId: 700000000,
            timestamp: Date.parse("2022-06-10T19:06:38"),
        },
        {
            id: "3673",
            attachments: [Attachments_1.AttachmentType.Image],
            authorId: "user300000000",
            channelId: 700000000,
            timestamp: Date.parse("2022-06-10T19:06:39"),
        },
    ],
};
