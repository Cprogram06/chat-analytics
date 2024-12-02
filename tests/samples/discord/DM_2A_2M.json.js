"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedParse = void 0;
const Common_1 = require("@tests/samples/discord/Common");
exports.expectedParse = {
    guilds: [Common_1.PGUILD_DM],
    channels: [
        {
            id: "530805775262679064",
            type: "dm",
            avatar: undefined,
        },
    ],
    authors: [Common_1.PAUTHOR_MLOMB, Common_1.PAUTHOR_SOMEONE],
    messages: [
        {
            id: "530805779645595660",
            authorId: Common_1.PAUTHOR_MLOMB.id,
            channelId: "530805775262679064",
            textContent: "blah",
            timestamp: Date.parse("2019-01-04T17:52:39.762+00:00"),
            reactions: [[{ text: "👆" }, 42]],
        },
        {
            id: "538148765782114306",
            authorId: Common_1.PAUTHOR_SOMEONE.id,
            channelId: "530805775262679064",
            textContent: "something something text",
            timestamp: Date.parse("2019-01-25T00:11:04.083+00:00"),
        },
    ],
};
