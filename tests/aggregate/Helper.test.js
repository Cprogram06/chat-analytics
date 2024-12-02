"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Common_1 = require("@pipeline/aggregate/Common");
const Filters_1 = require("@pipeline/aggregate/Filters");
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const BitStream_1 = require("@pipeline/serialization/BitStream");
const MessagesArray_1 = require("@pipeline/serialization/MessagesArray");
const Common_2 = require("@tests/aggregate/Common");
let db;
let filters;
let allowedAuthors;
let allowedChannels;
let allowedDays;
let allMessages;
beforeAll(async () => {
    db = await (0, Common_2.loadTestDatabase)();
    allMessages = [];
    let channelIndex = 0;
    for (const channel of db.channels) {
        const stream = new BitStream_1.BitStream(db.messages.buffer);
        if (channel.msgAddr !== undefined) {
            stream.offset = channel.msgAddr;
            const arr = new MessagesArray_1.MessagesArray(db.bitConfig, stream, channel.msgCount);
            for (const msg of arr) {
                allMessages.push({ msg, channelIndex });
            }
        }
        channelIndex++;
    }
    const dateKeys = (0, Common_1.computeCommonBlockData)(db).timeKeys.dateKeys;
    allowedAuthors = db.authors.slice(0, db.authors.length / 2).map((_, i) => i);
    allowedChannels = db.channels.slice(0, db.channels.length / 2).map((_, i) => i);
    const days = dateKeys.slice(dateKeys.length / 3, (dateKeys.length / 3) * 2);
    allowedDays = days.map((_, i) => Math.floor(dateKeys.length / 3) + i);
    filters = new Filters_1.Filters(db);
    filters.updateAuthors(allowedAuthors);
    filters.updateChannels(allowedChannels);
    filters.updateStartDate(days[0]);
    filters.updateEndDate(days[days.length - 1]);
});
it("should have the correct number of active days", () => {
    expect(filters.numActiveDays).toBe(allowedDays.length);
});
describe("filterMessages", () => {
    test.each(
    // prettier-ignore
    [
        { authors: false, channels: false, time: false, },
        { authors: false, channels: false, time: true, },
        { authors: false, channels: true, time: false, },
        { authors: false, channels: true, time: true, },
        { authors: true, channels: false, time: false, },
        { authors: true, channels: false, time: true, },
        { authors: true, channels: true, time: false, },
        { authors: true, channels: true, time: true, },
    ])(`filters with active %p`, (activeFilters) => {
        const fn = jest.fn();
        (0, Helpers_1.filterMessages)(fn, db, filters, activeFilters);
        const expectedMessages = allMessages.filter(({ channelIndex, msg }) => {
            return ((!activeFilters.authors || allowedAuthors.includes(msg.authorIndex)) &&
                (!activeFilters.channels || allowedChannels.includes(channelIndex)) &&
                (!activeFilters.time || allowedDays.includes(msg.dayIndex)));
        });
        expect(fn).toHaveBeenCalledTimes(expectedMessages.length);
        // we only check 100 messages since the test is slow
        for (let i = 0; i < expectedMessages.length; i += Math.floor(expectedMessages.length / 100)) {
            const msg = expectedMessages[i].msg;
            expect(fn).toHaveBeenCalledWith(expect.objectContaining({
                authorIndex: msg.authorIndex,
                dayIndex: msg.dayIndex,
                secondOfDay: msg.secondOfDay,
                langIndex: msg.langIndex,
            }));
        }
    });
});
