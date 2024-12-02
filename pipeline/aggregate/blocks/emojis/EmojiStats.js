"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const fn = (database, filters, common, args) => {
    const inText = {
        regular: 0,
        custom: 0,
        unique: 0,
        messagesWithAtLeastOneEmoji: 0,
        counts: {
            emojis: new Array(database.emojis.length).fill(0),
            authors: new Array(database.authors.length).fill(0),
            channels: new Array(database.channels.length).fill(0),
        },
        set: new Set(),
    };
    const inReactions = {
        regular: 0,
        custom: 0,
        unique: 0,
        messagesWithAtLeastOneEmoji: 0,
        counts: {
            emojis: new Array(database.emojis.length).fill(0),
            authors: new Array(database.authors.length).fill(0),
            channels: new Array(database.channels.length).fill(0),
        },
        set: new Set(),
    };
    const processEmojiInGroup = (emojiGroup, index, count, authorIndex, channelIndex) => {
        emojiGroup.counts.emojis[index] += count;
        emojiGroup.counts.authors[authorIndex] += count;
        emojiGroup.counts.channels[channelIndex] += count;
        if (database.emojis[index].type === "custom")
            emojiGroup.custom += count;
        else
            emojiGroup.regular += count;
        emojiGroup.set.add(index);
    };
    const processMessage = (msg) => {
        const emojis = msg.emojis;
        if (emojis) {
            for (const emoji of emojis) {
                processEmojiInGroup(inText, emoji[0], emoji[1], msg.authorIndex, msg.channelIndex);
                inText.messagesWithAtLeastOneEmoji++;
            }
        }
        const reactions = msg.reactions;
        if (reactions) {
            for (const reaction of reactions) {
                processEmojiInGroup(inReactions, reaction[0], reaction[1], msg.authorIndex, msg.channelIndex);
                inReactions.messagesWithAtLeastOneEmoji++;
            }
        }
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters);
    inText.unique = inText.set.size;
    inText.set = undefined;
    inReactions.unique = inReactions.set.size;
    inReactions.set = undefined;
    return {
        inText,
        inReactions,
    };
};
exports.default = {
    key: "emoji/stats",
    triggers: ["authors", "channels", "time"],
    fn,
};
