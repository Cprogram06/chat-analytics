"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedParse = void 0;
const Attachments_1 = require("@pipeline/Attachments");
const Common_1 = require("@tests/samples/messenger/Common");
exports.expectedParse = {
    guilds: [Common_1.PGUILD_DEFAULT],
    channels: [{ id: "inbox/alice_aaaaaaaaaa", guildId: 0, type: "dm" }],
    authors: [
        { id: "Alice", name: "Alice", bot: false },
        { id: "Bob", name: "Bob", bot: false },
    ],
    messages: [
        {
            attachments: [Attachments_1.AttachmentType.Image],
            authorId: "Bob",
            channelId: "inbox/alice_aaaaaaaaaa",
            textContent: undefined,
            timestamp: 1415147240411,
        },
        {
            attachments: [Attachments_1.AttachmentType.Sticker],
            authorId: "Bob",
            channelId: "inbox/alice_aaaaaaaaaa",
            textContent: undefined,
            timestamp: 1415147254275,
        },
        {
            attachments: [Attachments_1.AttachmentType.Audio],
            authorId: "Alice",
            channelId: "inbox/alice_aaaaaaaaaa",
            textContent: undefined,
            timestamp: 1415147297141,
        },
        {
            attachments: [Attachments_1.AttachmentType.Other],
            authorId: "Bob",
            channelId: "inbox/alice_aaaaaaaaaa",
            textContent: undefined,
            timestamp: 1415147308604,
        },
        {
            authorId: "Bob",
            channelId: "inbox/alice_aaaaaaaaaa",
            textContent: "you what",
            timestamp: 1415147325354,
        },
        {
            authorId: "Bob",
            channelId: "inbox/alice_aaaaaaaaaa",
            textContent: "Whats up!",
            timestamp: 1415147681489,
        },
        {
            authorId: "Alice",
            channelId: "inbox/alice_aaaaaaaaaa",
            textContent: "Hello",
            timestamp: 1415147732056,
        },
    ],
};
