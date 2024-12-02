"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const fn = (database, filters, common) => {
    const res = {
        perDay: [],
        perWeek: [],
        perMonth: [],
    };
    const { keyToTimestamp } = common;
    const { dateToWeekIndex, dateToMonthIndex } = common.timeKeys;
    // fill empty
    for (const ts of keyToTimestamp.date) {
        res.perDay.push({
            ts,
            v: 0,
        });
    }
    for (const ts of keyToTimestamp.week) {
        res.perWeek.push({
            ts,
            v: 0,
        });
    }
    for (const ts of keyToTimestamp.month) {
        res.perMonth.push({
            ts,
            v: 0,
        });
    }
    const processMessage = (msg) => {
        res.perDay[msg.dayIndex].v++;
        res.perWeek[dateToWeekIndex[msg.dayIndex]].v++;
        res.perMonth[dateToMonthIndex[msg.dayIndex]].v++;
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters, {
        authors: true,
        channels: true,
        // do not filter by time
        time: false,
    });
    return res;
};
exports.default = {
    key: "messages/per-period",
    triggers: ["authors", "channels"],
    fn,
};
