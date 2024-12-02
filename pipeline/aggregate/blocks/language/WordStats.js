"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const fn = (database, filters, common, args) => {
    const res = {
        perMonth: [],
        counts: {
            authors: new Array(database.authors.length).fill(0),
            channels: new Array(database.channels.length).fill(0),
        },
    };
    const { keyToTimestamp } = common;
    const { dateToMonthIndex } = common.timeKeys;
    // fill empty
    for (const ts of keyToTimestamp.month) {
        res.perMonth.push({
            ts,
            v: 0,
        });
    }
    // skip work if invalid
    if (args.wordIndex < 0)
        return res;
    const processMessage = (msg) => {
        if (!msg.hasWords)
            return;
        const wordInMsg = msg.words?.find(([widx, _]) => widx === args.wordIndex);
        if (wordInMsg !== undefined) {
            const count = wordInMsg[1];
            res.perMonth[dateToMonthIndex[msg.dayIndex]].v += count;
            res.counts.authors[msg.authorIndex] += count;
            res.counts.channels[msg.channelIndex] += count;
        }
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters, {
        authors: true,
        channels: true,
        time: true,
    });
    return res;
};
exports.default = {
    key: "language/word-stats",
    triggers: ["authors", "channels", "time"],
    fn,
};
