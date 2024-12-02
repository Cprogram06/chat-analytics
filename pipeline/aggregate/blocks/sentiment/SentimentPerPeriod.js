"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const fn = (database, filters, common, args) => {
    const res = {
        positiveMessages: 0,
        negativeMessages: 0,
        neutralMessages: 0,
        perMonth: [],
        perWeek: [],
    };
    const { keyToTimestamp } = common;
    const { monthKeys, weekKeys, dateToMonthIndex, dateToWeekIndex } = common.timeKeys;
    // fill empty
    for (const ts of keyToTimestamp.month) {
        res.perMonth.push({
            t: ts,
            p: 0,
            n: 0,
            z: 0,
            diffP: 0,
            diffN: 0,
            percP: 0,
            percN: 0,
        });
    }
    for (const ts of keyToTimestamp.week) {
        res.perWeek.push({
            t: ts,
            p: 0,
            n: 0,
            z: 0,
            diffP: 0,
            diffN: 0,
            percP: 0,
            percN: 0,
        });
    }
    const processMessage = (msg) => {
        const sentiment = msg.sentiment;
        if (sentiment !== undefined) {
            if (sentiment === 0) {
                res.neutralMessages++;
                res.perMonth[dateToMonthIndex[msg.dayIndex]].z += 1;
                res.perWeek[dateToWeekIndex[msg.dayIndex]].z += 1;
            }
            else if (sentiment > 0) {
                res.positiveMessages++;
                res.perMonth[dateToMonthIndex[msg.dayIndex]].p += 1;
                res.perWeek[dateToWeekIndex[msg.dayIndex]].p += 1;
            }
            else {
                res.negativeMessages++;
                res.perMonth[dateToMonthIndex[msg.dayIndex]].n -= 1;
                res.perWeek[dateToWeekIndex[msg.dayIndex]].n -= 1;
            }
        }
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters, { channels: true, authors: true, time: false });
    const post = (e) => {
        const p = Math.abs(e.p);
        const n = Math.abs(e.n);
        const total = p + n + e.z;
        const diff = p - n;
        e.diffP = Math.max(0, diff);
        e.diffN = Math.min(0, diff);
        if (total > 0) {
            e.percP = (p / total) * 100;
            e.percN = (-n / total) * 100;
        }
    };
    res.perWeek.forEach(post);
    res.perMonth.forEach(post);
    return res;
};
exports.default = {
    key: "sentiment/per-period",
    triggers: ["authors", "channels"],
    fn,
};
