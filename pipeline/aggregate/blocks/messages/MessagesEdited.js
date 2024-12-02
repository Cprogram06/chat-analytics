"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Common_1 = require("@pipeline/aggregate/Common");
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const fn = (database, filters) => {
    const authorsEdited = new Array(database.authors.length).fill(0);
    const channelsEdited = new Array(database.channels.length).fill(0);
    let editedInLessThan1Second = 0;
    const editTimes = new Uint32Array(database.numMessages).fill(0xfffffff0);
    let editTimesCount = 0;
    const processMessage = (msg) => {
        if (msg.hasEdits) {
            authorsEdited[msg.authorIndex]++;
            channelsEdited[msg.channelIndex]++;
            const editTime = msg.editedAfter;
            editTimes[editTimesCount++] = editTime;
            if (editTime <= 1)
                editedInLessThan1Second++;
        }
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters);
    return {
        count: {
            authors: authorsEdited,
            channels: channelsEdited,
        },
        editedInLessThan1Second,
        editTimeDistribution: (0, Common_1.computeVariableDistribution)(editTimes, editTimesCount),
    };
};
exports.default = {
    key: "messages/edited",
    triggers: ["authors", "channels", "time"],
    fn,
};
