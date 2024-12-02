"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const Series_1 = require("@pipeline/aggregate/blocks/timeline/Series");
const fn = (database, filters, common, args) => {
    const { keyToTimestamp } = common;
    const { dateKeys } = common.timeKeys;
    const computeForSeries = (def) => {
        let foundAtLeastOneMessage = false;
        // the day each author posted their first message
        const firstMessageDay = new Array(database.authors.length).fill(-1);
        const processMessage = (msg) => {
            if (msg.guildIndex === def.guildIndex || msg.channelIndex === def.channelIndex) {
                if (firstMessageDay[msg.authorIndex] === -1 || msg.dayIndex < firstMessageDay[msg.authorIndex])
                    firstMessageDay[msg.authorIndex] = msg.dayIndex;
                foundAtLeastOneMessage = true;
            }
        };
        (0, Helpers_1.filterMessages)(processMessage, database, filters, { channels: true, authors: true, time: false });
        // count the number of authors who posted their first message on each day
        const newAuthorsInDay = new Array(database.time.numDays).fill(0);
        for (const dayIndex of firstMessageDay) {
            if (dayIndex !== -1)
                newAuthorsInDay[dayIndex]++;
        }
        const growth = [];
        if (foundAtLeastOneMessage) {
            // compute the growth
            let accum = 0;
            for (let i = 0; i < database.time.numDays; i++) {
                accum += newAuthorsInDay[i];
                growth.push({
                    ts: keyToTimestamp.date[i],
                    v: accum,
                });
            }
            // last data point
            growth.push({
                ts: keyToTimestamp.date[dateKeys.length - 1],
                v: accum,
            });
        }
        return growth;
    };
    const res = {
        perSeriesPerMonth: (0, Series_1.generateSeries)(database).map(computeForSeries),
    };
    return res;
};
exports.default = {
    key: "timeline/growth",
    triggers: ["authors", "channels"],
    fn,
};
