"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDatetime = exports.formatTime = exports.genTimeKeys = exports.Day = void 0;
/**
 * Represents a day in the Gregorian calendar in the form of [year, month, day].
 * Note that `month` is one-based, not zero-based. As opposed to JS Date's `monthIndex`.
 *
 * I prefer working with Day objects instead of Date objects to avoid all kind of problems 😁
 */
class Day {
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
    /** Creates a Day from a JS Date object */
    static fromDate(date) {
        return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }
    /** Creates a Day from a time key. If month or day is not provided, it will default to the earliest that matches */
    static fromKey(key) {
        const arr = key.split("-").map(Number);
        switch (arr.length) {
            case 1:
                return new Day(arr[0], 1, 1);
            case 2:
                return new Day(arr[0], arr[1], 1);
            case 3:
                return new Day(arr[0], arr[1], arr[2]);
            default:
                // 0 <= arr[3] <= 3
                return new Day(arr[0], arr[1], arr[3] * 7 + 1);
        }
    }
    /** Creates a Day from a binary number generated by `toBinary` */
    static fromBinary(binary) {
        const year = binary >>> 9;
        const month = (binary >>> 5) & 0b1111;
        const day = binary & 0b11111;
        return new Day(year, month, day);
    }
    /** Converts the day into a JS Date object */
    toDate() {
        return new Date(this.year, this.month - 1, this.day);
    }
    /** Converts the day into a binary number */
    toBinary() {
        return (this.year << 9) | (this.month << 5) | this.day;
    }
    /** Returns the UTC timestamp for this day */
    toTimestamp() {
        return this.toDate().getTime();
    }
    get yearKey() {
        return `${this.year}`;
    }
    get monthKey() {
        return `${this.year}-${this.month}`;
    }
    get weekKey() {
        const week = Math.floor((this.day - 1) / 7);
        return `${this.year}-${this.month}--${week}`;
    }
    get dateKey() {
        return `${this.monthKey}-${this.day}`;
    }
    /** Returns a new Day instance for `days` days into the future */
    nextDays(days) {
        const d = this.toDate();
        d.setDate(d.getDate() + days);
        return Day.fromDate(d);
    }
    /** Returns a new Day instance for the following day */
    nextDay() {
        return this.nextDays(1);
    }
    /** Equal */
    static eq(a, b) {
        return a.year === b.year && a.month === b.month && a.day === b.day;
    }
    /** Less than */
    static lt(a, b) {
        return (a.year < b.year ||
            (a.year === b.year && a.month < b.month) ||
            (a.year === b.year && a.month === b.month && a.day < b.day));
    }
    /** Greater than */
    static gt(a, b) {
        return (a.year > b.year ||
            (a.year === b.year && a.month > b.month) ||
            (a.year === b.year && a.month === b.month && a.day > b.day));
    }
    /** Min between two days (past) */
    static min(a, b) {
        return Day.lt(a, b) ? a : b;
    }
    /** Max between two days (future) */
    static max(a, b) {
        return Day.gt(a, b) ? a : b;
    }
    /** Clamp day between two days */
    static clamp(day, a, b) {
        return Day.min(Day.max(day, a), b);
    }
}
exports.Day = Day;
Day.LOWEST = new Day(0, 0, 0);
Day.HIGHEST = new Day(9999, 12, 31);
/**
 * Generates each time key contained in an interval of time [start, end].
 * Also generates indexes to map between date keys and the rest.
 */
const genTimeKeys = (start, end) => {
    // check start <= end
    if (Day.lt(end, start))
        throw new Error("genTimeKeys: start must be before end");
    const onePastEnd = end.nextDay();
    const dateKeys = [];
    const weekKeys = [];
    const monthKeys = [];
    const yearKeys = [];
    const dateToWeekIndex = [];
    const dateToMonthIndex = [];
    const dateToYearIndex = [];
    let day = start;
    while (!Day.eq(day, onePastEnd)) {
        const dateKey = day.dateKey;
        const monthKey = day.monthKey;
        const weekKey = day.weekKey;
        const yearKey = day.yearKey;
        if (weekKeys.length === 0 || weekKeys[weekKeys.length - 1] !== weekKey)
            weekKeys.push(weekKey);
        if (monthKeys.length === 0 || monthKeys[monthKeys.length - 1] !== monthKey)
            monthKeys.push(monthKey);
        if (yearKeys.length === 0 || yearKeys[yearKeys.length - 1] !== yearKey)
            yearKeys.push(yearKey);
        dateKeys.push(dateKey);
        dateToWeekIndex.push(weekKeys.length - 1);
        dateToMonthIndex.push(monthKeys.length - 1);
        dateToYearIndex.push(yearKeys.length - 1);
        day = day.nextDay();
    }
    return {
        dateKeys,
        weekKeys,
        monthKeys,
        yearKeys,
        dateToMonthIndex,
        dateToWeekIndex,
        dateToYearIndex,
    };
};
exports.genTimeKeys = genTimeKeys;
const f = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
};
const DateTimeFormatters = {
    y: new Intl.DateTimeFormat(undefined, { year: f.year }),
    ym: new Intl.DateTimeFormat(undefined, { year: f.year, month: f.month }),
    ymd: new Intl.DateTimeFormat(undefined, { year: f.year, month: f.month, day: f.day }),
    ymdh: new Intl.DateTimeFormat(undefined, {
        year: f.year,
        month: f.month,
        day: f.day,
        hour: f.hour,
    }),
    symd: new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    }),
    ymdhm: new Intl.DateTimeFormat(undefined, {
        year: f.year,
        month: f.month,
        day: f.day,
        hour: f.hour,
        minute: f.minute,
    }),
    ymdhms: new Intl.DateTimeFormat(undefined, {
        year: f.year,
        month: f.month,
        day: f.day,
        hour: f.hour,
        minute: f.minute,
        second: f.second,
    }),
};
// we cant test this since it depends on the browser locale
// setting it as a parameter will force us to create a new Intl.DateTimeFormat each call
// istanbul ignore next
/** Format a Day (+seconds) into a human readable string */
const formatTime = (format, day, secondsOfDay = 0) => {
    const d = day.toDate();
    d.setSeconds(secondsOfDay);
    return DateTimeFormatters[format].format(d);
};
exports.formatTime = formatTime;
/** Format a Datetime into a human readable string. @see formatTime */
const formatDatetime = (format, datetime) => {
    if (datetime === undefined)
        return "-";
    return (0, exports.formatTime)(format, Day.fromKey(datetime.key), datetime.secondOfDay);
};
exports.formatDatetime = formatDatetime;
