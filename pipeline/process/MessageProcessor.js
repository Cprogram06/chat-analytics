"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageProcessor = void 0;
const Time_1 = require("@pipeline/Time");
const IndexCounts_1 = require("@pipeline/process/IndexCounts");
const Emojis_1 = require("@pipeline/process/nlp/Emojis");
const FastTextModel_1 = require("@pipeline/process/nlp/FastTextModel");
const Sentiment_1 = require("@pipeline/process/nlp/Sentiment");
const Text_1 = require("@pipeline/process/nlp/Text");
const Tokenizer_1 = require("@pipeline/process/nlp/Tokenizer");
/**
 * The MessageProcessor takes PMessageGroup's and processes them into the Message's.
 * This class is extremely coupled with the DatabaseBuilder.
 *
 * It does all the necessary analysis.
 */
class MessageProcessor {
    constructor(builder) {
        this.builder = builder;
    }
    // download static data
    async init(env) {
        this.emojis = await Emojis_1.Emojis.load(env);
        this.langPredictModel = await FastTextModel_1.FastTextLID176Model.load(env);
        this.sentiment = await Sentiment_1.Sentiment.load(env, this.emojis);
    }
    processGroupToIntermediate(group) {
        // normalize and tokenize messages
        const tokenizations = group.map((msg) => msg.textContent ? (0, Tokenizer_1.tokenize)((0, Text_1.normalizeText)(msg.textContent)) : []);
        // combine text for all the messages in the group
        const allText = tokenizations
            .flat()
            .filter((token) => token.tag === "word")
            .map((token) => token.text)
            .join(" ")
            .toLowerCase();
        // detect language in the whole group text
        // this yields better accuracy
        let langIndex;
        if (allText.length > 0) {
            langIndex = this.langPredictModel.identifyLanguage(allText).iso639index;
        }
        return group.map((message, index) => this.processMessage(message, tokenizations[index], langIndex));
    }
    /** Process the given message. Also takes the tokens for the message, and other information. */
    processMessage(msg, tokens, langIndex) {
        const wordsCount = new IndexCounts_1.IndexCountsBuilder();
        const emojisCount = new IndexCounts_1.IndexCountsBuilder();
        const mentionsCount = new IndexCounts_1.IndexCountsBuilder();
        const reactionsCount = new IndexCounts_1.IndexCountsBuilder();
        const domainsCount = new IndexCounts_1.IndexCountsBuilder();
        if (msg.reactions) {
            for (const [emoji, count] of msg.reactions) {
                const symbol = (0, Text_1.normalizeText)(emoji.text);
                reactionsCount.incr(this.processEmoji(emoji.id === undefined
                    ? {
                        type: "unicode",
                        symbol,
                        name: this.emojis.getName(symbol),
                    }
                    : {
                        type: "custom",
                        id: emoji.id,
                        name: emoji.text,
                    }), count);
            }
        }
        // process tokens
        for (const { tag, text } of tokens) {
            switch (tag) {
                case "word":
                    const wordIdx = this.processWord(text);
                    if (wordIdx !== undefined)
                        wordsCount.incr(wordIdx);
                    break;
                case "emoji":
                    const symbol = (0, Text_1.normalizeText)(text); // to remove variants
                    emojisCount.incr(this.processEmoji({ type: "unicode", symbol, name: this.emojis.getName(symbol) }));
                    break;
                case "custom-emoji":
                    emojisCount.incr(this.processEmoji({ type: "custom", name: text }));
                    break;
                case "mention":
                    mentionsCount.incr(this.processMention(text));
                    break;
                case "url":
                    const domainIdx = this.processURL(text);
                    if (domainIdx !== undefined)
                        domainsCount.incr(domainIdx);
                    break;
            }
        }
        // sentiment analysis
        let sentiment = 0;
        if (langIndex) {
            sentiment = this.sentiment?.calculate(tokens, langIndex) || 0;
        }
        let replyOffset = undefined;
        if (msg.replyTo) {
            // store replyTo index
            replyOffset = this.builder.replyIds.length;
            this.builder.replyIds.push(msg.replyTo);
        }
        // TODO: timezones
        const date = new Date(msg.timestamp);
        const day = Time_1.Day.fromDate(date);
        let editedAfter = undefined;
        if (msg.timestampEdit !== undefined) {
            // time difference between sending the message and its last edit
            editedAfter = Math.ceil((new Date(msg.timestampEdit).getTime() - date.getTime()) / 1000);
        }
        return {
            dayIndex: day.toBinary(),
            secondOfDay: date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours()),
            editedAfter,
            authorIndex: this.builder.authors.getIndex(msg.authorId),
            replyOffset,
            langIndex,
            sentiment: langIndex !== undefined ? sentiment : undefined,
            words: wordsCount.toArray(),
            emojis: emojisCount.toArray(),
            mentions: mentionsCount.toArray(),
            reactions: reactionsCount.toArray(),
            domains: domainsCount.toArray(),
            attachments: IndexCounts_1.IndexCountsBuilder.fromList(msg.attachments ?? []).toArray(),
        };
    }
    forceStringCopy(str) {
        // see https://stackoverflow.com/questions/31712808/how-to-force-javascript-to-deep-copy-a-string
        return (str = (" " + str).slice(1)); // force string copy, avoid slicing
    }
    processWord(word) {
        const { words } = this.builder;
        const wordKey = (0, Text_1.matchFormat)(word);
        // only keep words between [2, 30] chars
        if (word.length > 1 && word.length <= 30) {
            let wordIdx = words.getIndex(wordKey);
            if (wordIdx === undefined)
                wordIdx = words.set(wordKey, this.forceStringCopy(word));
            return wordIdx;
        }
        return undefined;
    }
    processEmoji(emoji) {
        const { emojis } = this.builder;
        const emojiKey = (0, Text_1.normalizeText)(emoji.name).toLowerCase();
        let emojiIdx = emojis.getIndex(emojiKey);
        if (emojiIdx === undefined) {
            emojiIdx = emojis.set(emojiKey, emoji);
        }
        else {
            const oldEmoji = emojis.getByIndex(emojiIdx);
            // prettier-ignore
            if (oldEmoji.type === "custom" && emoji.type === "custom" &&
                oldEmoji.id === undefined && emoji.id !== undefined) {
                // ID is new, replace
                emojis.set(emojiKey, emoji, 999);
            }
        }
        return emojiIdx;
    }
    processMention(mention) {
        const { mentions } = this.builder;
        const mentionKey = (0, Text_1.matchFormat)(mention);
        let mentionIdx = mentions.getIndex(mentionKey);
        if (mentionIdx === undefined)
            mentionIdx = mentions.set(mentionKey, this.forceStringCopy(mention));
        return mentionIdx;
    }
    processURL(url) {
        const { domains } = this.builder;
        // TODO: transform URL only messages to attachments
        try {
            const hostname = new URL(url).hostname.toLowerCase();
            let domainIdx = domains.getIndex(hostname);
            if (domainIdx === undefined)
                domainIdx = domains.set(hostname, hostname);
            return domainIdx;
        }
        catch (ex) {
            return undefined;
        }
    }
}
exports.MessageProcessor = MessageProcessor;
