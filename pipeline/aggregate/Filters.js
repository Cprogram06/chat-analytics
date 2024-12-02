"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filters = void 0;
const Time_1 = require("@pipeline/Time");
/**
 * Keeps the state of the currently applied filters in the UI.
 * Stores the selected time range and the index of the selected channels & authors.
 *
 * Can be updated and queried.
 */
class Filters {
    constructor(database) {
        this.channels = [];
        this.authors = new Uint8Array(database.authors.length);
        this.startDayIndex = 0;
        this.endDayIndex = 0;
        // fill date keys
        this.dateKeys = (0, Time_1.genTimeKeys)(Time_1.Day.fromKey(database.time.minDate), Time_1.Day.fromKey(database.time.maxDate)).dateKeys;
    }
    /** Updates the indexes of the selected channels */
    updateChannels(channels) {
        this.channels = channels;
    }
    /** Updates the indexes of the selected authors */
    updateAuthors(authors) {
        this.authors.fill(0);
        for (const authorIndex of authors)
            this.authors[authorIndex] = 1;
    }
    /** Updates the start date of the selected time range */
    updateStartDate(startDate) {
        this.startDayIndex = this.dateKeys.indexOf(startDate);
    }
    /** Updates the end date of the selected time range */
    updateEndDate(endDate) {
        this.endDayIndex = this.dateKeys.indexOf(endDate);
    }
    /** @returns true if the channel is currently selected */
    hasChannel(channelIndex) {
        // there aren't that many channels
        // no need to optimize
        return this.channels.indexOf(channelIndex) !== -1;
    }
    /** @returns true if the author is currently selected */
    hasAuthor(authorIndex) {
        return this.authors[authorIndex] > 0;
    }
    /** @returns true if the day is inside the selected time range */
    inTime(dayIndex) {
        return this.startDayIndex <= dayIndex && dayIndex <= this.endDayIndex;
    }
    /** @returns the number of days that are currently selected */
    get numActiveDays() {
        return this.endDayIndex - this.startDayIndex + 1;
    }
}
exports.Filters = Filters;
