"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const fn = (database, filters, common, args) => {
    const mentionsCount = new Array(database.mentions.length).fill(0);
    const authorsReplyCount = new Array(database.authors.length).fill(0);
    let topTotalReactions = [];
    let topSingleReactions = [];
    const processMessage = (msg) => {
        const mentions = msg.mentions;
        if (mentions) {
            for (const mention of mentions) {
                mentionsCount[mention[0]] += mention[1];
            }
        }
        const reactions = msg.reactions;
        if (reactions) {
            let reactionCount = 0, maxReactionCount = 0;
            for (const reaction of reactions) {
                reactionCount += reaction[1];
                maxReactionCount = Math.max(maxReactionCount, reaction[1]);
            }
            if (reactionCount > 0) {
                if (topTotalReactions.length < 3 ||
                    reactionCount > topTotalReactions[topTotalReactions.length - 1][1]) {
                    topTotalReactions.push([msg, reactionCount]);
                    topTotalReactions = topTotalReactions.sort((a, b) => b[1] - a[1]).slice(0, 3);
                }
            }
            if (maxReactionCount > 0) {
                if (topSingleReactions.length < 3 ||
                    maxReactionCount > topSingleReactions[topSingleReactions.length - 1][1]) {
                    topSingleReactions.push([msg, maxReactionCount]);
                    topSingleReactions = topSingleReactions.sort((a, b) => b[1] - a[1]).slice(0, 3);
                }
            }
        }
        if (msg.hasReply) {
            authorsReplyCount[msg.authorIndex] += 1;
        }
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters);
    return {
        mentionsCount,
        authorsReplyCount,
        topTotalReactions: topTotalReactions.map(([msg, _]) => msg.getFullMessage()),
        topSingleReactions: topSingleReactions.map(([msg, _]) => msg.getFullMessage()),
    };
};
exports.default = {
    key: "interaction/stats",
    triggers: ["authors", "channels", "time"],
    fn,
};
