"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const fn = (database, filters, common, args) => {
    const res = {
        positiveMessages: 0,
        negativeMessages: 0,
        neutralMessages: 0,
    };
    const processMessage = (msg) => {
        const sentiment = msg.sentiment;
        if (sentiment !== undefined) {
            if (sentiment === 0)
                res.neutralMessages++;
            else if (sentiment > 0)
                res.positiveMessages++;
            else
                res.negativeMessages++;
        }
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters);
    return res;
};
exports.default = {
    key: "sentiment/stats",
    triggers: ["authors", "channels", "time"],
    fn,
};
