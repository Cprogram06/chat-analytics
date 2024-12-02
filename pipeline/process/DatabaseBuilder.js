"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseBuilder = void 0;
const Languages_1 = require("@pipeline/Languages");
const Time_1 = require("@pipeline/Time");
const parse_1 = require("@pipeline/parse");
const BigMap_1 = require("@pipeline/process/BigMap");
const ChannelMessages_1 = require("@pipeline/process/ChannelMessages");
const IndexCounts_1 = require("@pipeline/process/IndexCounts");
const IndexedMap_1 = require("@pipeline/process/IndexedMap");
const MessageProcessor_1 = require("@pipeline/process/MessageProcessor");
const Util_1 = require("@pipeline/process/Util");
const Stopwords_1 = require("@pipeline/process/nlp/Stopwords");
const MessagesArray_1 = require("@pipeline/serialization/MessagesArray");
/**
 * Builds the Database object from input files.
 *
 * ⚠️ You probably want to use `generateDatabase` instead of manually creating a DatabaseBuilder.
 */
class DatabaseBuilder {
    get numChannels() { return this.channels.size; } // prettier-ignore
    get numAuthors() { return this.authors.size; } // prettier-ignore
    get numMessages() { return [...this.messagesInChannel.values()].reduce((acc, mc) => acc + mc.numMessages, 0); } // prettier-ignore
    constructor(config, env) {
        this.config = config;
        this.env = env;
        // data stores
        this.guilds = new IndexedMap_1.IndexedMap();
        this.channels = new IndexedMap_1.IndexedMap();
        this.authors = new IndexedMap_1.IndexedMap();
        this.words = new IndexedMap_1.IndexedMap();
        this.emojis = new IndexedMap_1.IndexedMap();
        this.mentions = new IndexedMap_1.IndexedMap();
        this.domains = new IndexedMap_1.IndexedMap();
        this.replyIds = [];
        /** Each channel has its own ChannelMessages instance */
        this.messagesInChannel = new Map();
        /** Global messages processor */
        this.messageProcessor = new MessageProcessor_1.MessageProcessor(this);
        /////////////////////////////////////////////////////
        //                                                 //
        //    Counting, reindexing, making final objects   //
        //                                                 //
        /////////////////////////////////////////////////////
        this.minDate = Time_1.Day.HIGHEST;
        this.maxDate = Time_1.Day.LOWEST;
        this.guildCounts = [];
        this.channelCounts = [];
        this.authorCounts = [];
        this.wordsCounts = [];
        this.langCounts = [];
        this.guildsRank = [];
        this.channelsRank = [];
        this.authorsRank = [];
        this.wordsRank = [];
        /** We want to store participants for DM chats to later override the channel name with "Alice & Bob" */
        this.dmParticipants = new Map();
        this.parser = (0, parse_1.createParser)(config.platform);
        this.parser.on("guild", (guild, at) => this.guilds.set(guild.id, guild, at));
        this.parser.on("channel", (channel, at) => this.channels.set(channel.id, channel, at));
        this.parser.on("author", (author, at) => this.authors.set(author.id, author, at));
        this.parser.on("message", (message, at) => {
            // NOTE: `at` is not supported for messages
            let channelMessages = this.messagesInChannel.get(message.channelId);
            if (channelMessages === undefined) {
                // new channel found
                channelMessages = new ChannelMessages_1.ChannelMessages();
                this.messagesInChannel.set(message.channelId, channelMessages);
            }
            channelMessages.addMessage(message);
        });
    }
    /** Initialize static data. Must be called before `processFiles` */
    async init() {
        await this.messageProcessor.init(this.env);
        this.stopwords = await Stopwords_1.Stopwords.load(this.env);
    }
    /** Process the provided files */
    async processFiles(files) {
        let filesProcessed = 0;
        this.env.progress?.stat("total_files", files.length);
        for (const file of files) {
            this.env.progress?.new("Processing", file.name);
            await this.processFile(file);
            this.env.progress?.success();
            this.env.progress?.stat("processed_files", ++filesProcessed);
        }
    }
    /** Process the provided file. Throws in case of error. */
    async processFile(file) {
        try {
            for await (const _ of this.parser.parse(file, this.env.progress))
                this.processPendingMessages();
        }
        catch (err) {
            if (err instanceof Error) {
                const newErr = new Error(`Error parsing file "${file.name}":\n\n${err.message}`);
                newErr.stack = err.stack;
                throw newErr;
            }
            // hopefully handled by WorkerApp.ts
            throw err;
        }
        this.markEOF();
        this.processPendingMessages();
    }
    /** Goes through all ChannelMessage and process all the messages that remain pending */
    processPendingMessages() {
        for (const chMsgs of this.messagesInChannel.values()) {
            chMsgs.process((group) => {
                const processed = this.messageProcessor.processGroupToIntermediate(group);
                for (let i = 0; i < processed.length; i++) {
                    this.postProcessMessage(group[i], processed[i]);
                }
                return processed;
            });
        }
        // update stats
        this.env.progress?.stat("channels", this.numChannels);
        this.env.progress?.stat("authors", this.numAuthors);
        this.env.progress?.stat("messages", this.numMessages);
    }
    /** Singnals EOF to all ChannelMessages. MUST be called */
    markEOF() {
        for (const chMsgs of this.messagesInChannel.values()) {
            chMsgs.markEOF();
        }
    }
    postProcessMessage(pmsg, msg) {
        const channelIndex = this.channels.getIndex(pmsg.channelId);
        const channel = this.channels.getByIndex(channelIndex);
        const guildIndex = this.guilds.getIndex(channel.guildId);
        // count stuff
        this.guildCounts[guildIndex] = (this.guildCounts[guildIndex] || 0) + 1;
        this.channelCounts[channelIndex] = (this.channelCounts[channelIndex] || 0) + 1;
        this.authorCounts[msg.authorIndex] = (this.authorCounts[msg.authorIndex] || 0) + 1;
        if (msg.words) {
            for (const [idx, count] of msg.words) {
                this.wordsCounts[idx] = (this.wordsCounts[idx] || 0) + count;
            }
        }
        if (msg.langIndex !== undefined) {
            this.langCounts[msg.langIndex] = (this.langCounts[msg.langIndex] || 0) + 1;
        }
        // if this channel is a DM, store participants
        if (channel.type === "dm") {
            if (!this.dmParticipants.has(channel.id)) {
                this.dmParticipants.set(channel.id, []);
            }
            const participants = this.dmParticipants.get(channel.id);
            if (!participants.includes(msg.authorIndex)) {
                participants.push(msg.authorIndex);
            }
        }
        // update min/max date
        const day = Time_1.Day.fromBinary(msg.dayIndex);
        if (Time_1.Day.lt(day, this.minDate))
            this.minDate = day;
        if (Time_1.Day.gt(day, this.maxDate))
            this.maxDate = day;
    }
    /** Detects languages that appear more than a threshold */
    detectLanguages() {
        // we determine which languages we have to correctly filter stopwords
        const totalWithLang = this.langCounts.reduce((a, b) => a + b, 0);
        const langs = this.langCounts
            .map((count, index) => ({ code: Languages_1.LanguageCodes[index], ratio: count / totalWithLang }))
            // we need AT LEAST 3% to consider reliable
            .filter((l) => l.ratio >= 0.03)
            // sort most used
            .sort((a, b) => b.ratio - a.ratio)
            // only keep the code
            .map((l) => l.code);
        return langs;
    }
    /** Filter words. Skip unfrequent words and stopwords. */
    filterWords(langs) {
        this.env.progress?.new("Filtering words...");
        const numWords = this.wordsCounts.length;
        for (let oldIndex = 0; oldIndex < numWords; oldIndex++) {
            let skip = false;
            // only keep words if the have been used more than once, IF there are too many (more than 100k words)
            if (this.wordsCounts[oldIndex] <= 1 && numWords > 100000)
                skip = true;
            // only keep words if they are not stopwords
            if (this.stopwords.isStopword(this.words.getByIndex(oldIndex), langs))
                skip = true;
            // set the count to -1 so it gets filtered out
            if (skip)
                this.wordsCounts[oldIndex] = -1;
            this.env.progress?.progress("number", oldIndex, numWords);
        }
        this.env.progress?.success();
    }
    /**
     * [+] Why indexing?
     * While we process messages it is more efficient to store an index to the actual author/word/whatever
     * than storing a full RawID that may potentially be a large string.
     * [+] Why the burden of reindexing?
     * We want to sort authors, channels and such by the number of messages they have, so it doesn't need to
     * be done in the UI (also all indexes end up being nice :) )
     * [+] How?
     * During processing we use the index that IndexedMap provides. After all processing is done we use the
     * counts to generate a mapping between the old index and the "final" ones with `rank`.
     */
    countAndReindex() {
        this.env.progress?.new("Computing new indexes...");
        this.guildsRank = (0, Util_1.rank)(this.guildCounts);
        this.channelsRank = (0, Util_1.rank)(this.channelCounts);
        this.authorsRank = (0, Util_1.rank)(this.authorCounts);
        this.wordsRank = (0, Util_1.rank)(this.wordsCounts);
        this.env.progress?.success();
    }
    /** Makes final objects for Guilds, Channels and Authors */
    makeFinalObjects() {
        this.env.progress?.new("Building final objects...");
        // prettier-ignore
        const guilds = (0, Util_1.remap)(this.makeFinalGuild.bind(this), this.guilds.values, this.guildsRank, this.env.progress);
        const channels = (0, Util_1.remap)(this.makeFinalChannel.bind(this), this.channels.values, this.channelsRank, this.env.progress);
        const authors = (0, Util_1.remap)(this.makeFinalAuthor.bind(this), this.authors.values, this.authorsRank, this.env.progress);
        // prettier-ignore
        const words = (0, Util_1.remap)((w) => w, this.words.values, this.wordsRank, this.env.progress);
        this.env.progress?.success();
        return { guilds, channels, authors, words };
    }
    /** Transforms a parser PGuild into a final Guild */
    makeFinalGuild(guild) {
        return {
            // (just skips the id)
            name: guild.name,
            avatar: guild.avatar,
        };
    }
    /** Transforms a parser PChannel into a final Channel */
    makeFinalChannel(channel) {
        const participants = this.dmParticipants.get(channel.id) || [];
        // I really don't want to do this here, but I don't
        // like the alternatives right now
        const formatParticipantName = (i) => {
            const name = this.authors.getByIndex(i).name;
            if (name.split("#").pop()?.length === 4)
                // skip Discord discriminator
                return name.slice(0, -5);
            return name;
        };
        return {
            name: channel.type !== "dm"
                ? // non DMs preserve the name
                    channel.name
                : // DMs use the names of the participants "Alice & Bob"
                    participants.map(formatParticipantName).join(" & "),
            type: channel.type,
            avatar: channel.avatar,
            guildIndex: this.guildsRank[this.guilds.getIndex(channel.guildId)],
            participants: participants.length > 0 ? participants : undefined,
            // the following are set making the final messages
            msgAddr: undefined,
            msgCount: undefined,
        };
    }
    /** Transforms a parser PAuthor into a final Author */
    makeFinalAuthor(author, oldIndex) {
        return {
            i: author.id,
            n: author.name,
            b: author.bot === true ? true : undefined,
            // only keep avatars if the author is in the top 1000 authors
            a: this.authorsRank[oldIndex] < 1000 ? author.avatar : undefined,
        };
    }
    compactMessagesData(channels, dateKeys) {
        this.env.progress?.new("Compacting messages data");
        /** Return the minimum amount of bits needed to store a given number */
        const numBitsFor = (n) => Math.max(1, n === 0 ? 1 : 32 - Math.clz32(n));
        const bitConfig = {
            dayBits: numBitsFor(dateKeys.length),
            authorIdxBits: numBitsFor(this.authors.size),
            wordIdxBits: numBitsFor(this.words.size),
            emojiIdxBits: numBitsFor(this.emojis.size),
            mentionsIdxBits: numBitsFor(this.mentions.size),
            domainsIdxBits: numBitsFor(this.domains.size),
        };
        const finalMessages = new MessagesArray_1.MessagesArray(bitConfig);
        const messageAddresses = new BigMap_1.BigMap();
        const totalMessages = this.numMessages;
        let alreadyCounted = 0;
        for (const [id, mc] of this.messagesInChannel) {
            const channelIndex = this.channelsRank[this.channels.getIndex(id)];
            const channel = channels[channelIndex];
            channel.msgAddr = finalMessages.byteLength;
            channel.msgCount = mc.numMessages;
            for (const { id, msg } of mc.processedMessages()) {
                // reindex day and author
                msg.dayIndex = dateKeys.indexOf(Time_1.Day.fromBinary(msg.dayIndex).dateKey);
                msg.authorIndex = this.authorsRank[msg.authorIndex];
                // reindex and skip words
                if (msg.words) {
                    const newWords = new IndexCounts_1.IndexCountsBuilder();
                    for (const [oldWordIdx, count] of msg.words) {
                        const newWordIndex = this.wordsRank[oldWordIdx];
                        // if the index is -1, the word was filtered out
                        if (newWordIndex >= 0)
                            newWords.incr(newWordIndex, count);
                    }
                    msg.words = newWords.toArray();
                    if (msg.words.length === 0)
                        delete msg.words;
                }
                // store the address of the message
                messageAddresses.set(id, finalMessages.byteLength);
                if (msg.replyOffset !== undefined) {
                    // this is a reply, lookup the original ID
                    const replyID = this.replyIds[msg.replyOffset];
                    const replyAddress = messageAddresses.get(replyID);
                    if (replyID !== undefined && replyAddress !== undefined) {
                        // the original message was found, store the address
                        msg.replyOffset = replyAddress;
                    }
                }
                finalMessages.push(msg);
                this.env.progress?.progress("number", ++alreadyCounted, totalMessages);
            }
        }
        this.env.progress?.success();
        return { finalMessages };
    }
    build() {
        if (this.numMessages === 0)
            throw new Error("No messages found. Are you sure you are using the right platform?");
        const langs = this.detectLanguages();
        this.filterWords(langs);
        this.countAndReindex();
        const { guilds, channels, authors, words } = this.makeFinalObjects();
        const { dateKeys, monthKeys, yearKeys } = (0, Time_1.genTimeKeys)(this.minDate, this.maxDate);
        const { finalMessages } = this.compactMessagesData(channels, dateKeys);
        return {
            config: this.config,
            generatedAt: new Date().toISOString(),
            title: this.buildTitle(guilds, channels),
            langs,
            time: {
                minDate: this.minDate.dateKey,
                maxDate: this.maxDate.dateKey,
                numDays: dateKeys.length,
                numMonths: monthKeys.length,
                numYears: yearKeys.length,
            },
            guilds,
            channels,
            authors,
            words,
            emojis: this.emojis.values,
            mentions: this.mentions.values,
            domains: this.domains.values,
            messages: finalMessages.stream.buffer8,
            numMessages: finalMessages.length,
            bitConfig: finalMessages.bitConfig,
        };
    }
    /** Builds the final report title. Do we want to have this here? */
    buildTitle(guilds, channels) {
        // See report/components/Title.tsx
        if (this.config.platform !== "discord") {
            // We assume there is always only one guild.
            if (channels.length === 1)
                return channels[0].name;
            return guilds[0].name;
        }
        if (guilds.length > 1) {
            if (guilds.some((g) => g.name === "Direct Messages")) {
                return "Discord Servers and DMs";
            }
            return "Discord Servers";
        }
        const guild = guilds[0];
        if (guild.name !== "Direct Messages")
            return guild.name;
        if (channels.length === 1)
            return channels[0].name;
        if (channels.every((c) => c.type === "dm"))
            return "Discord DMs";
        if (channels.every((c) => c.type === "group"))
            return "Discord Groups";
        return "Discord Chats";
    }
}
exports.DatabaseBuilder = DatabaseBuilder;
