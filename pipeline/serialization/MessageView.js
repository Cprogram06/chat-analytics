"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageView = void 0;
const IndexCountsSerialization_1 = require("@pipeline/serialization/IndexCountsSerialization");
const MessageSerialization_1 = require("@pipeline/serialization/MessageSerialization");
/**
 * This is an alternative to the `readMessage` function. It deserializes parts of a Message on demand,
 * being faster when only a few fields are needed. Perfect for computing aggregate blocks, where
 * each block may need only a few and different fields.
 */
class MessageView {
    get hasText() { return (this.flags & MessageSerialization_1.MessageFlags.Text) > 0; } // prettier-ignore
    get hasReply() { return (this.flags & MessageSerialization_1.MessageFlags.Reply) > 0; } // prettier-ignore
    get hasEdits() { return (this.flags & MessageSerialization_1.MessageFlags.Edited) > 0; } // prettier-ignore
    get hasWords() { return (this.flags & MessageSerialization_1.MessageFlags.Words) > 0; } // prettier-ignore
    get hasEmojis() { return (this.flags & MessageSerialization_1.MessageFlags.Emojis) > 0; } // prettier-ignore
    get hasAttachments() { return (this.flags & MessageSerialization_1.MessageFlags.Attachments) > 0; } // prettier-ignore
    get hasReactions() { return (this.flags & MessageSerialization_1.MessageFlags.Reactions) > 0; } // prettier-ignore
    get hasMentions() { return (this.flags & MessageSerialization_1.MessageFlags.Mentions) > 0; } // prettier-ignore
    get hasDomains() { return (this.flags & MessageSerialization_1.MessageFlags.Domains) > 0; } // prettier-ignore
    constructor(stream, bitConfig) {
        // PERFORMANCE NOTE: this is probably the most performance-critical part of report aggregation
        // Instead of using `.hasXXX` we inline the checks to avoid the function call overhead, which REALLY adds up here
        this.stream = stream;
        this.bitConfig = bitConfig;
        // provided for convenience
        this.guildIndex = -1;
        this.channelIndex = -1;
        this.wordsOffset = 0;
        this.emojisOffset = 0;
        this.attachmentsOffset = 0;
        this.reactionsOffset = 0;
        this.mentionsOffset = 0;
        this.domainsOffset = 0;
        this.dayIndex = stream.getBits(bitConfig.dayBits);
        this.secondOfDay = stream.getBits(17);
        this.authorIndex = stream.getBits(bitConfig.authorIdxBits);
        this.flags = stream.getBits(9);
        if ((this.flags & MessageSerialization_1.MessageFlags.Reply) > 0)
            this.replyOffset = stream.readVarInt();
        if ((this.flags & MessageSerialization_1.MessageFlags.Edited) > 0)
            this.editedAfter = stream.readVarInt();
        if ((this.flags & MessageSerialization_1.MessageFlags.Text) > 0) {
            this.langIndex = stream.getBits(8);
            this.sentiment = stream.getBits(8) - 128;
        }
        if ((this.flags & MessageSerialization_1.MessageFlags.Words) > 0) {
            this.wordsOffset = stream.offset;
            (0, IndexCountsSerialization_1.skipIndexCounts)(stream, bitConfig.wordIdxBits);
        }
        if ((this.flags & MessageSerialization_1.MessageFlags.Emojis) > 0) {
            this.emojisOffset = stream.offset;
            (0, IndexCountsSerialization_1.skipIndexCounts)(stream, bitConfig.emojiIdxBits);
        }
        if ((this.flags & MessageSerialization_1.MessageFlags.Attachments) > 0) {
            this.attachmentsOffset = stream.offset;
            (0, IndexCountsSerialization_1.skipIndexCounts)(stream, 3);
        }
        if ((this.flags & MessageSerialization_1.MessageFlags.Reactions) > 0) {
            this.reactionsOffset = stream.offset;
            (0, IndexCountsSerialization_1.skipIndexCounts)(stream, bitConfig.emojiIdxBits);
        }
        if ((this.flags & MessageSerialization_1.MessageFlags.Mentions) > 0) {
            this.mentionsOffset = stream.offset;
            (0, IndexCountsSerialization_1.skipIndexCounts)(stream, bitConfig.mentionsIdxBits);
        }
        if ((this.flags & MessageSerialization_1.MessageFlags.Domains) > 0) {
            this.domainsOffset = stream.offset;
            (0, IndexCountsSerialization_1.skipIndexCounts)(stream, bitConfig.domainsIdxBits);
        }
    }
    get words() {
        if (this.wordsOffset === 0)
            return undefined;
        this.stream.offset = this.wordsOffset;
        return (0, IndexCountsSerialization_1.readIndexCounts)(this.stream, this.bitConfig.wordIdxBits);
    }
    get emojis() {
        if (this.emojisOffset === 0)
            return undefined;
        this.stream.offset = this.emojisOffset;
        return (0, IndexCountsSerialization_1.readIndexCounts)(this.stream, this.bitConfig.emojiIdxBits);
    }
    get attachments() {
        if (this.attachmentsOffset === 0)
            return undefined;
        this.stream.offset = this.attachmentsOffset;
        return (0, IndexCountsSerialization_1.readIndexCounts)(this.stream, 3);
    }
    get reactions() {
        if (this.reactionsOffset === 0)
            return undefined;
        this.stream.offset = this.reactionsOffset;
        return (0, IndexCountsSerialization_1.readIndexCounts)(this.stream, this.bitConfig.emojiIdxBits);
    }
    get mentions() {
        if (this.mentionsOffset === 0)
            return undefined;
        this.stream.offset = this.mentionsOffset;
        return (0, IndexCountsSerialization_1.readIndexCounts)(this.stream, this.bitConfig.mentionsIdxBits);
    }
    get domains() {
        if (this.domainsOffset === 0)
            return undefined;
        this.stream.offset = this.domainsOffset;
        return (0, IndexCountsSerialization_1.readIndexCounts)(this.stream, this.bitConfig.domainsIdxBits);
    }
    get reply() {
        if (this.hasReply) {
            this.stream.offset = this.replyOffset;
            return new MessageView(this.stream, this.bitConfig);
        }
        return undefined;
    }
    getFullMessage() {
        return {
            dayIndex: this.dayIndex,
            secondOfDay: this.secondOfDay,
            editedAfter: this.editedAfter,
            authorIndex: this.authorIndex,
            replyOffset: this.replyOffset,
            langIndex: this.langIndex,
            sentiment: this.sentiment,
            words: this.words,
            emojis: this.emojis,
            attachments: this.attachments,
            reactions: this.reactions,
            mentions: this.mentions,
            domains: this.domains,
            guildIndex: this.guildIndex,
            channelIndex: this.channelIndex,
        };
    }
}
exports.MessageView = MessageView;
