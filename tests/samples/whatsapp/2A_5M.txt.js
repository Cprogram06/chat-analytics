"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedParse = void 0;
const Attachments_1 = require("@pipeline/Attachments");
const Common_1 = require("@tests/samples/whatsapp/Common");
exports.expectedParse = {
    guilds: [Common_1.PGUILD_DEFAULT],
    channels: [
        {
            guildId: 0,
            type: "dm",
        },
    ],
    authors: [
        {
            name: "A",
            bot: false,
        },
        {
            name: "B",
            bot: false,
        },
    ],
    messages: [
        {
            authorId: "A",
            textContent: "Hi",
            timestamp: new Date(2021, 0, 1, 12, 0, 0).getTime(),
        },
        {
            authorId: "B",
            textContent: "Whats up?",
            timestamp: new Date(2021, 0, 1, 12, 1, 0).getTime(),
        },
        {
            authorId: "A",
            textContent: "All good",
            timestamp: new Date(2021, 0, 1, 12, 2, 0).getTime(),
        },
        {
            authorId: "A",
            textContent: "This message should be reordered",
            timestamp: new Date(2021, 0, 1, 12, 2, 0).getTime(),
        },
        {
            authorId: "B",
            attachments: [Attachments_1.AttachmentType.Other],
            timestamp: new Date(2021, 0, 1, 12, 3, 0).getTime(),
        },
    ],
};
