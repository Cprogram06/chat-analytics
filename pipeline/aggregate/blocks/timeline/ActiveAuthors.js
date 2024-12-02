"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const Series_1 = require("@pipeline/aggregate/blocks/timeline/Series");
const fn = (database, filters, common, args) => {
    const { keyToTimestamp } = common;
    const { monthKeys, dateToMonthIndex } = common.timeKeys;
    const computeForSeries = (def) => {
        let foundAtLeastOneMessage = false;
        // TODO: optimize this with a bitset or something, using a Set may use too much memory if there are many authors
        const authorsPresentInMonth = [];
        for (const _ of monthKeys)
            authorsPresentInMonth.push(new Set());
        const processMessage = (msg) => {
            if (msg.guildIndex === def.guildIndex || msg.channelIndex === def.channelIndex) {
                authorsPresentInMonth[dateToMonthIndex[msg.dayIndex]].add(msg.authorIndex);
                foundAtLeastOneMessage = true;
            }
        };
        (0, Helpers_1.filterMessages)(processMessage, database, filters, { channels: true, authors: true, time: false });
        const items = [];
        if (foundAtLeastOneMessage) {
            for (let i = 0; i < monthKeys.length; i++) {
                items.push({
                    ts: keyToTimestamp.month[i],
                    v: authorsPresentInMonth[i].size,
                });
            }
        }
        return items;
    };
    const res = {
        perSeriesPerMonth: (0, Series_1.generateSeries)(database).map(computeForSeries),
    };
    return res;
};
exports.default = {
    key: "timeline/active-authors",
    triggers: ["authors", "channels"],
    fn,
};
