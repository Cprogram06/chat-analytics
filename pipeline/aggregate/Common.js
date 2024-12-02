"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeVariableDistribution = exports.computeCommonBlockData = void 0;
const Time_1 = require("@pipeline/Time");
const computeCommonBlockData = (database) => {
    const start = Time_1.Day.fromKey(database.time.minDate);
    const end = Time_1.Day.fromKey(database.time.maxDate);
    const timeKeys = (0, Time_1.genTimeKeys)(start, end);
    const res = {
        timeKeys,
        dayOfWeek: [],
        keyToTimestamp: {
            date: [],
            week: [],
            month: [],
        },
    };
    let i = 0;
    for (const dateKey of timeKeys.dateKeys) {
        const day = Time_1.Day.fromKey(dateKey);
        res.keyToTimestamp.date.push(day.toTimestamp());
        res.dayOfWeek[i] = day.toDate().getDay();
        i++;
    }
    for (const weekKey of timeKeys.weekKeys)
        res.keyToTimestamp.week.push(Time_1.Day.fromKey(weekKey).toTimestamp());
    for (const monthKey of timeKeys.monthKeys)
        res.keyToTimestamp.month.push(Time_1.Day.fromKey(monthKey).toTimestamp());
    return res;
};
exports.computeCommonBlockData = computeCommonBlockData;
const computeVariableDistribution = (values, count) => {
    const res = {
        total: count,
        count: [],
        boxplot: {
            min: 0,
            whiskerMin: 0,
            q1: 0,
            median: 0,
            q3: 0,
            whiskerMax: 0,
            max: 0,
            outliers: 0,
        },
    };
    // not enough data
    if (count <= 1)
        return res;
    // sort times ascending
    // IMPORTANT: it assumes that all values AFTER `count` are bigger than all values BEFORE.
    //            Preferably, initialize the values with a big value like 0xfffffff0
    values.sort();
    // calculate boxplot
    const min = values[0];
    const max = values[count - 1];
    const q1_i = Math.floor(count * 0.25);
    const q2_i = Math.floor(count * 0.5);
    const q3_i = Math.floor(count * 0.75);
    const q1 = values[q1_i];
    const q2 = values[q2_i];
    const q3 = values[q3_i];
    const iqr = q3 - q1;
    const lower = Math.floor(Math.max(min, q1 - iqr * 1.5));
    const upper = Math.ceil(Math.min(max, q3 + iqr * 1.5));
    // calculate distribution
    const buckets = Math.min(upper - lower, 3 * 60) || 0; // up to 180 divisions
    res.count = new Array(buckets).fill(0);
    res.boxplot = {
        min,
        whiskerMin: lower,
        q1,
        median: q2,
        q3,
        whiskerMax: upper,
        max,
        outliers: 0,
    };
    for (let i = 0; i < count; i++) {
        const time = values[i];
        if (time >= lower && time < upper) {
            // Order of operations is critical to avoid rounding issues
            res.count[Math.floor((buckets / (upper - lower)) * (time - lower))]++;
        }
        else {
            res.boxplot.outliers++;
        }
    }
    return res;
};
exports.computeVariableDistribution = computeVariableDistribution;
