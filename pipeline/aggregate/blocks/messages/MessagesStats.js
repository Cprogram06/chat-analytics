"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Attachments_1 = require("@pipeline/Attachments");
const Time_1 = require("@pipeline/Time");
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const MAX_AUTHORS = 20;
const NEW_CONVERSATION_THRESHOLD = 3600 / 2; // in seconds
const fn = (database, filters, common, args) => {
    const { dateKeys, weekKeys, monthKeys, yearKeys, dateToWeekIndex, dateToMonthIndex, dateToYearIndex } = common.timeKeys;
    let total = 0, edited = 0, withText = 0, withLinks = 0;
    const authorsCount = new Array(database.authors.length).fill(0);
    const channelsCount = new Array(database.channels.length).fill(0);
    const positiveMessagesCount = new Array(database.authors.length).fill(0);
    const negativeMessagesCount = new Array(database.authors.length).fill(0);
    const neutralMessagesCount = new Array(database.authors.length).fill(0);
    const responsesCount = new Array(database.authors.length).fill(0);
    const reactionsCount = new Array(database.authors.length).fill(0);
    const authorConvoCount = new Array(database.authors.length).fill(0);
    const channerConvoCount = new Array(database.authors.length).fill(0);
    const attachmentsCount = {
        [Attachments_1.AttachmentType.Image]: 0,
        [Attachments_1.AttachmentType.ImageAnimated]: 0,
        [Attachments_1.AttachmentType.Video]: 0,
        [Attachments_1.AttachmentType.Sticker]: 0,
        [Attachments_1.AttachmentType.Audio]: 0,
        [Attachments_1.AttachmentType.Document]: 0,
        [Attachments_1.AttachmentType.Other]: 0,
    };
    const hourlyCounts = new Array(24 * database.time.numDays).fill(0);
    const dailyCounts = new Array(database.time.numDays).fill(0);
    const monthlyCounts = new Array(database.time.numMonths).fill(0);
    const yearlyCounts = new Array(database.time.numYears).fill(0);
    const weekdayHourCounts = new Array(7 * 24).fill(0);
    // first, find the MAX_AUTHORS authors with the most messages
    const authorsCounts = [...authorConvoCount];
    (0, Helpers_1.filterMessages)((msg) => authorsCounts[msg.authorIndex]++, database, filters);
    // sort authors by count
    const sortedAuthors = authorsCounts
        .map((count, index) => ({ count, index }))
        .filter((author) => author.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_AUTHORS);
    // make a lookup table for author index -> sorted index or -1 if not present
    const authorsLookup = new Array(database.authors.length).fill(-1);
    for (let i = 0; i < sortedAuthors.length; i++)
        //
        authorsLookup[sortedAuthors[i].index] = i;
    // make a nodes tables
    const N = sortedAuthors.length;
    const table = new Uint16Array((N * (N + 1)) / 2).fill(0); // the table is symmetric
    const contexts = new Array(database.channels.length).fill({
        activeParticipant: new Array(N).fill(false),
        lastMessageTimestamp: -1,
    });
    const processMessage = (msg) => {
        total++;
        if (msg.hasEdits)
            edited++;
        if (msg.hasDomains)
            withLinks++;
        if (msg.langIndex !== undefined)
            withText++;
        if (msg.hasReply) {
            responsesCount[msg.authorIndex] += 1;
        }
        const emojis = msg.emojis;
        if (emojis) {
            reactionsCount[msg.authorIndex] += 1;
        }
        const reactions = msg.reactions;
        if (reactions) {
            reactionsCount[msg.authorIndex] += 1;
        }
        //authorConvo
        const d = Time_1.Day.fromKey(dateKeys[msg.dayIndex]).toDate();
        d.setSeconds(msg.secondOfDay);
        const ts = d.getTime();
        const ctx = contexts[msg.channelIndex];
        // start of a new conversation
        if (ctx.lastMessageTimestamp === -1 || ts - ctx.lastMessageTimestamp > NEW_CONVERSATION_THRESHOLD * 1000) {
            // mark in table in M^2
            const participants = ctx.activeParticipant
                .map((active, index) => (active ? index : -1))
                .filter((x) => x !== -1);
            const M = participants.length;
            for (let i = 0; i < M; i++) {
                for (let j = i + 1; j < M; j++) {
                    const a = participants[i];
                    const b = participants[j];
                    const k = Math.min(a, b);
                    const l = Math.max(a, b);
                    // since the matrix is symmetric and k <= l, we can compute the index as follow:
                    // See: https://stackoverflow.com/a/9040526/2840384
                    const index = k * N - (k * (k + 1)) / 2 + l;
                    if (!(index >= 0 && index < table.length)) {
                        console.log(a, b, k, l, index);
                        debugger;
                    }
                    console.assert(index >= 0 && index < table.length);
                    table[index]++;
                }
            }
            // reset
            ctx.activeParticipant.fill(false);
            channerConvoCount[msg.channelIndex]++;
            // we have to check since we are not filtering by author
            if (filters.hasAuthor(msg.authorIndex)) {
                authorConvoCount[msg.authorIndex]++;
            }
        }
        ctx.lastMessageTimestamp = ts;
        const authorSortedIndex = authorsLookup[msg.authorIndex];
        if (authorSortedIndex !== -1) {
            ctx.activeParticipant[authorSortedIndex] = true;
        }
        authorsCount[msg.authorIndex]++;
        channelsCount[msg.channelIndex]++;
        hourlyCounts[msg.dayIndex * 24 + Math.floor(msg.secondOfDay / 3600)]++;
        dailyCounts[msg.dayIndex]++;
        monthlyCounts[dateToMonthIndex[msg.dayIndex]]++;
        yearlyCounts[dateToYearIndex[msg.dayIndex]]++;
        const dayOfWeek = common.dayOfWeek[msg.dayIndex];
        weekdayHourCounts[dayOfWeek * 24 + Math.floor(msg.secondOfDay / 3600)]++;
        const attachments = msg.attachments;
        if (attachments) {
            for (const attachment of attachments) {
                attachmentsCount[attachment[0]] += attachment[1];
            }
        }
        const sentiment = msg.sentiment;
        // Add positive messages count per author
        if (sentiment !== undefined) {
            if (sentiment === 0)
                neutralMessagesCount[msg.authorIndex]++;
            else if (sentiment > 0)
                positiveMessagesCount[msg.authorIndex]++;
            else
                negativeMessagesCount[msg.authorIndex]++;
        }
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters);
    // generate the nodes
    const nodes = [];
    for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
            const index = i * N - (i * (i + 1)) / 2 + j; // i <= j
            const c = table[index];
            if (c > 0) {
                nodes.push({ f: sortedAuthors[i].index, t: sortedAuthors[j].index, c });
            }
        }
    }
    const weekdayHourActivity = weekdayHourCounts.map((count, i) => {
        const weekday = Math.floor(i / 24);
        const hour = i % 24;
        return {
            value: count,
            hour: `${hour}hs`,
            weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekday],
        };
    });
    const findMostActive = (counts, buildDatetimeFn) => {
        let max = 0, maxIndex = -1;
        for (let i = 0; i < counts.length; i++) {
            if (counts[i] > max) {
                max = counts[i];
                maxIndex = i;
            }
        }
        return { messages: max, at: maxIndex === -1 ? undefined : buildDatetimeFn(maxIndex) };
    };
    // Calculate composite score
    const compositeScores = authorsCount.map((_, index) => {
        const compositeScore = ((reactionsCount[index] / Math.max(...reactionsCount)) * 0.1 +
            (authorConvoCount[index] / Math.max(...authorConvoCount)) * 0.3 +
            (responsesCount[index] / Math.max(...responsesCount)) * 0.3 +
            (positiveMessagesCount[index] / Math.max(...positiveMessagesCount)) * 0.2 +
            (authorsCount[index] / Math.max(...authorsCount)) * 0.1) *
            100;
        return compositeScore;
    });
    return {
        total,
        edited,
        numActiveDays: filters.numActiveDays,
        withAttachmentsCount: attachmentsCount,
        withText,
        withLinks,
        nodes,
        compositeScores,
        counts: {
            authors: authorsCount,
            channels: channelsCount,
            positiveMessages: positiveMessagesCount,
            negativeMessages: negativeMessagesCount,
            neutralMessages: neutralMessagesCount,
            mostReply: responsesCount,
            mostEmoji: reactionsCount,
            mostAuthorConvo: authorConvoCount,
            mostChannelConvo: channerConvoCount,
        },
        weekdayHourActivity,
        mostActive: {
            hour: findMostActive(hourlyCounts, (i) => ({
                key: dateKeys[Math.floor(i / 24)],
                secondOfDay: (i % 24) * 3600,
            })),
            day: findMostActive(dailyCounts, (i) => ({ key: dateKeys[i] })),
            month: findMostActive(monthlyCounts, (i) => ({ key: monthKeys[i] })),
            year: findMostActive(yearlyCounts, (i) => ({ key: yearKeys[i] })),
        },
    };
};
exports.default = {
    key: "messages/stats",
    triggers: ["authors", "channels", "time"],
    fn,
};
