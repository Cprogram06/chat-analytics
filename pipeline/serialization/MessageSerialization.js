"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMessage = exports.writeMessage = exports.DefaultMessageBitConfig = exports.MessageFlags = void 0;
const IndexCountsSerialization_1 = require("@pipeline/serialization/IndexCountsSerialization");
/** These flags are used to encode the presence of optional fields in a Message */
// prettier-ignore
var MessageFlags;
(function (MessageFlags) {
    MessageFlags[MessageFlags["None"] = 0] = "None";
    MessageFlags[MessageFlags["Reply"] = 1] = "Reply";
    MessageFlags[MessageFlags["Edited"] = 2] = "Edited";
    MessageFlags[MessageFlags["Text"] = 4] = "Text";
    MessageFlags[MessageFlags["Words"] = 8] = "Words";
    MessageFlags[MessageFlags["Emojis"] = 16] = "Emojis";
    MessageFlags[MessageFlags["Attachments"] = 32] = "Attachments";
    MessageFlags[MessageFlags["Reactions"] = 64] = "Reactions";
    MessageFlags[MessageFlags["Mentions"] = 128] = "Mentions";
    MessageFlags[MessageFlags["Domains"] = 256] = "Domains";
})(MessageFlags = exports.MessageFlags || (exports.MessageFlags = {}));
/**
 * Default bit configuration for messages.
 * At the start we don't know how many authors, words, emojis, etc. we have, so we have to use a conservative
 * configuration that works for all possible values.
 *
 * These values are hand-picked.
 */
exports.DefaultMessageBitConfig = {
    dayBits: 21,
    authorIdxBits: 21,
    wordIdxBits: 21,
    emojiIdxBits: 18,
    mentionsIdxBits: 20,
    domainsIdxBits: 16,
};
/** Writes the message into the stream using the provided bit configuration */
const writeMessage = (message, stream, bitConfig) => {
    stream.setBits(bitConfig.dayBits, message.dayIndex);
    stream.setBits(17, message.secondOfDay); // 0-2^17 (needed 86400)
    stream.setBits(bitConfig.authorIdxBits, message.authorIndex);
    let flags = MessageFlags.None;
    if (message.replyOffset !== undefined)
        flags |= MessageFlags.Reply;
    if (message.editedAfter !== undefined)
        flags |= MessageFlags.Edited;
    if (message.langIndex !== undefined)
        flags |= MessageFlags.Text;
    if (message.words?.length)
        flags |= MessageFlags.Words;
    if (message.emojis?.length)
        flags |= MessageFlags.Emojis;
    if (message.attachments?.length)
        flags |= MessageFlags.Attachments;
    if (message.reactions?.length)
        flags |= MessageFlags.Reactions;
    if (message.mentions?.length)
        flags |= MessageFlags.Mentions;
    if (message.domains?.length)
        flags |= MessageFlags.Domains;
    stream.setBits(9, flags);
    if (flags & MessageFlags.Reply)
        stream.writeVarInt(message.replyOffset, 48);
    if (flags & MessageFlags.Edited)
        stream.writeVarInt(message.editedAfter);
    if (flags & MessageFlags.Text) {
        stream.setBits(8, message.langIndex); // 0-255
        stream.setBits(8, Math.max(-128, Math.min(127, message.sentiment)) + 128); // 0-255
    }
    if (flags & MessageFlags.Words)
        (0, IndexCountsSerialization_1.writeIndexCounts)(message.words, stream, bitConfig.wordIdxBits);
    if (flags & MessageFlags.Emojis)
        (0, IndexCountsSerialization_1.writeIndexCounts)(message.emojis, stream, bitConfig.emojiIdxBits);
    if (flags & MessageFlags.Attachments)
        (0, IndexCountsSerialization_1.writeIndexCounts)(message.attachments, stream, 3);
    if (flags & MessageFlags.Reactions)
        (0, IndexCountsSerialization_1.writeIndexCounts)(message.reactions, stream, bitConfig.emojiIdxBits);
    if (flags & MessageFlags.Mentions)
        (0, IndexCountsSerialization_1.writeIndexCounts)(message.mentions, stream, bitConfig.mentionsIdxBits);
    if (flags & MessageFlags.Domains)
        (0, IndexCountsSerialization_1.writeIndexCounts)(message.domains, stream, bitConfig.domainsIdxBits);
};
exports.writeMessage = writeMessage;
/**
 * Reads a whole message from the stream using the provided bit configuration.
 * If you don't need all the fields, you may want to use the `MessageView` class instead.
 */
const readMessage = (stream, bitConfig) => {
    const day = stream.getBits(bitConfig.dayBits);
    const secondOfDay = stream.getBits(17);
    const authorIndex = stream.getBits(bitConfig.authorIdxBits);
    const flags = stream.getBits(9);
    const message = {
        dayIndex: day,
        secondOfDay,
        authorIndex,
    };
    if (flags & MessageFlags.Reply)
        message.replyOffset = stream.readVarInt();
    if (flags & MessageFlags.Edited)
        message.editedAfter = stream.readVarInt();
    if (flags & MessageFlags.Text) {
        message.langIndex = stream.getBits(8);
        message.sentiment = stream.getBits(8) - 128;
    }
    if (flags & MessageFlags.Words)
        message.words = (0, IndexCountsSerialization_1.readIndexCounts)(stream, bitConfig.wordIdxBits);
    if (flags & MessageFlags.Emojis)
        message.emojis = (0, IndexCountsSerialization_1.readIndexCounts)(stream, bitConfig.emojiIdxBits);
    if (flags & MessageFlags.Attachments)
        message.attachments = (0, IndexCountsSerialization_1.readIndexCounts)(stream, 3);
    if (flags & MessageFlags.Reactions)
        message.reactions = (0, IndexCountsSerialization_1.readIndexCounts)(stream, bitConfig.emojiIdxBits);
    if (flags & MessageFlags.Mentions)
        message.mentions = (0, IndexCountsSerialization_1.readIndexCounts)(stream, bitConfig.mentionsIdxBits);
    if (flags & MessageFlags.Domains)
        message.domains = (0, IndexCountsSerialization_1.readIndexCounts)(stream, bitConfig.domainsIdxBits);
    return message;
};
exports.readMessage = readMessage;
