"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedParse = void 0;
const Common_1 = require("@tests/samples/whatsapp/Common");
exports.expectedParse = {
    guilds: [Common_1.PGUILD_DEFAULT],
    channels: [
        {
            guildId: 0,
            type: "group",
        },
    ],
    authors: ["Alice", "Bob", "Eve", "Mallory", "Trent"].map((name) => ({
        name,
        bot: false,
    })),
    messages: [
        {
            channelId: 0,
            authorId: "Alice",
            textContent: "boiii",
            timestamp: new Date(2020, 8, 12, 23, 55, 0).getTime(),
        },
        {
            channelId: 0,
            authorId: "Trent",
            textContent: "👩🏻‍⚖️",
            timestamp: new Date(2020, 8, 12, 23, 55, 0).getTime(),
        },
    ],
};
