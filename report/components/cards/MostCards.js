"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MostMentioned = exports.MostLinks = exports.MostLinkedDomains = exports.MostReactionReceiver = exports.MostProducerEmojis = exports.MostUsedEmojis = exports.MostConversations = exports.MostMessagesChannels = exports.MostRepliesAuthors = exports.MostNegativeMessages = exports.TopCompositeScores = exports.MostPositiveMessages = exports.MostMessagesAuthors = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BlockHook_1 = require("@report/BlockHook");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const AuthorLabel_1 = require("@report/components/core/labels/AuthorLabel");
const ChannelLabel_1 = require("@report/components/core/labels/ChannelLabel");
const DomainLabel_1 = require("@report/components/core/labels/DomainLabel");
const EmojiLabel_1 = require("@report/components/core/labels/EmojiLabel");
const MentionLabel_1 = require("@report/components/core/labels/MentionLabel");
const MostUsed_1 = __importDefault(require("@report/components/viz/MostUsed"));
///////////////////////////
/// AUTHORS
///////////////////////////
const MostMessagesAuthors = () => ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Author", unit: "Total messages", counts: (0, BlockHook_1.useBlockData)("messages/stats")?.counts.authors, itemComponent: AuthorLabel_1.AuthorLabel, maxItems: Math.min(15, (0, WorkerWrapper_1.getDatabase)().authors.length), colorHue: 240 }));
exports.MostMessagesAuthors = MostMessagesAuthors;
const MostPositiveMessages = () => ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Author", unit: "Postive Messages Count", counts: (0, BlockHook_1.useBlockData)("messages/stats")?.counts.positiveMessages, itemComponent: AuthorLabel_1.AuthorLabel, maxItems: Math.min(50, (0, WorkerWrapper_1.getDatabase)().authors.length), colorHue: 240 }));
exports.MostPositiveMessages = MostPositiveMessages;
const TopCompositeScores = () => {
    const [compositeScores, setCompositeScores] = (0, react_1.useState)(undefined);
    const handleExportCSV = (data, messages, reactions, replies, positiveM, convo, authorNames, authorID) => {
        if (data && authorNames.length === data.length) {
            setCompositeScores(data);
            // Perform any data processing or formatting if needed
            // Create an array of CSV rows with additional data for sorting
            const csvRowsWithSorting = authorNames.map((name, index) => ({
                name,
                data: data[index],
                messages: messages[index],
                reactions: reactions[index],
                replies: replies[index],
                positiveM: positiveM[index],
                convo: convo[index],
                id: authorID[index],
            }));
            // Sort the CSV rows based on the composite score in descending order
            csvRowsWithSorting.sort((a, b) => b.data - a.data);
            // Convert the sorted rows back to CSV rows
            const csvRows = csvRowsWithSorting.map((entry) => `${entry.id},${entry.name},${entry.data},${entry.messages},${entry.reactions},${entry.replies},${entry.positiveM},${entry.convo},`);
            // Add headers
            const csvContent = "AuthorID,Author,Composite Score,Messages Count (10%),Reactions Count (10%),Replies Count (30%),Positive Messages Count (20%),Conversation Count (30%),AXS Allocation\n" +
                csvRows.join("\n");
            // Get the current date and time
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
            // Create a Blob and initiate the download with the dynamic file name
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `CompositeScore_${formattedDate}.csv`;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    const counts = (0, BlockHook_1.useBlockData)("messages/stats")?.compositeScores;
    const messagesCount = (0, BlockHook_1.useBlockData)("messages/stats")?.counts.authors;
    const reactionsCount = (0, BlockHook_1.useBlockData)("messages/stats")?.counts.mostEmoji;
    const repliesCount = (0, BlockHook_1.useBlockData)("messages/stats")?.counts.mostReply;
    const posMesCount = (0, BlockHook_1.useBlockData)("messages/stats")?.counts.positiveMessages;
    const disconCount = (0, BlockHook_1.useBlockData)("messages/stats")?.counts.mostAuthorConvo;
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { style: {
                    display: "block",
                    backgroundColor: "#217346",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    margin: "0 auto",
                    transition: "background-color 0.3s, color 0.3s",
                }, onClick: () => handleExportCSV(counts ?? [], messagesCount ?? [], reactionsCount ?? [], repliesCount ?? [], posMesCount ?? [], disconCount ?? [], (0, WorkerWrapper_1.getDatabase)().authors.map((author) => author.n), (0, WorkerWrapper_1.getDatabase)().authors.map((author) => author.i)), children: "Export Scores" }), (0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Author", unit: "Composite Score", counts: counts, itemComponent: AuthorLabel_1.AuthorLabel, maxItems: Math.min(50, (0, WorkerWrapper_1.getDatabase)().authors.length), colorHue: 240 })] }));
};
exports.TopCompositeScores = TopCompositeScores;
const MostNegativeMessages = () => ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Author", unit: "Negative Messages Count", counts: (0, BlockHook_1.useBlockData)("messages/stats")?.counts.negativeMessages, itemComponent: AuthorLabel_1.AuthorLabel, maxItems: Math.min(50, (0, WorkerWrapper_1.getDatabase)().authors.length), colorHue: 240 }));
exports.MostNegativeMessages = MostNegativeMessages;
const MostRepliesAuthors = () => ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Author", unit: "# of messages replied", counts: (0, BlockHook_1.useBlockData)("interaction/stats")?.authorsReplyCount, itemComponent: AuthorLabel_1.AuthorLabel, maxItems: Math.min(15, (0, WorkerWrapper_1.getDatabase)().authors.length), colorHue: 240 }));
exports.MostRepliesAuthors = MostRepliesAuthors;
///////////////////////////
/// CHANNELS
///////////////////////////
const MostMessagesChannels = () => ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Channel", unit: "Total messages", counts: (0, BlockHook_1.useBlockData)("messages/stats")?.counts.channels, itemComponent: ChannelLabel_1.ChannelLabel, maxItems: Math.min(15, (0, WorkerWrapper_1.getDatabase)().channels.length), colorHue: 266 }));
exports.MostMessagesChannels = MostMessagesChannels;
///////////////////////////
/// CONVERSATIONS
///////////////////////////
const MostConversations = ({ options }) => {
    const conversationStats = (0, BlockHook_1.useBlockData)("interaction/conversation-stats");
    return ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: options[0] === 0 ? "Author" : "Channel", unit: "# of conversations started", counts: conversationStats
            ? conversationStats[options[0] === 0 ? "authorConversations" : "channelConversations"]
            : undefined, itemComponent: options[0] === 0 ? AuthorLabel_1.AuthorLabel : ChannelLabel_1.ChannelLabel, maxItems: Math.min(15, Math.max((0, WorkerWrapper_1.getDatabase)().authors.length, (0, WorkerWrapper_1.getDatabase)().channels.length)), colorHue: options[0] === 0 ? 240 : 266 }));
};
exports.MostConversations = MostConversations;
///////////////////////////
/// EMOJIS
///////////////////////////
const EmojiFilterFns = {
    "0": undefined,
    "1": (index) => (0, WorkerWrapper_1.getDatabase)().emojis[index].type === "unicode",
    "2": (index) => (0, WorkerWrapper_1.getDatabase)().emojis[index].type === "custom", // custom emoji
};
const EmojiFilterPlaceholders = {
    "0": 'Filter emoji... (e.g. "fire", "🔥" or ":pepe:")',
    "1": 'Filter emoji... (e.g. "fire" or "🔥")',
    "2": 'Filter emoji... (e.g. ":pepe:")',
};
const EmojisTransformFilter = (filter) => filter.replace(/:/g, "");
const EmojisIndexOf = (value) => {
    const rawEmoji = (0, WorkerWrapper_1.getDatabase)().emojis.findIndex((e) => e.name === value);
    if (rawEmoji === -1)
        return (0, WorkerWrapper_1.getFormatCache)().emojis.indexOf(value);
    return rawEmoji;
};
const EmojisInFilter = (index, filter) => (0, WorkerWrapper_1.getFormatCache)().emojis[index].includes(filter);
const MostUsedEmojis = ({ options }) => {
    const emojiStats = (0, BlockHook_1.useBlockData)("emoji/stats");
    return ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Emoji", unit: options[1] === 1 ? "Times reacted" : "Times used", counts: emojiStats ? emojiStats[options[1] === 1 ? "inReactions" : "inText"].counts.emojis : undefined, filter: EmojiFilterFns[options[0]], maxItems: Math.min(15, (0, WorkerWrapper_1.getDatabase)().emojis.length), itemComponent: EmojiLabel_1.EmojiLabel, searchable: true, searchPlaceholder: EmojiFilterPlaceholders[options[0]], transformFilter: EmojisTransformFilter, indexOf: EmojisIndexOf, inFilter: EmojisInFilter }));
};
exports.MostUsedEmojis = MostUsedEmojis;
const MostProducerEmojis = ({ options }) => {
    const emojiStats = (0, BlockHook_1.useBlockData)("emoji/stats");
    return ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: options[0] === 0 ? "Author" : "Channel", unit: "# of emoji used", counts: emojiStats ? emojiStats.inText.counts[options[0] === 0 ? "authors" : "channels"] : undefined, maxItems: Math.min(15, Math.max((0, WorkerWrapper_1.getDatabase)().authors.length, (0, WorkerWrapper_1.getDatabase)().channels.length)), itemComponent: options[0] === 0 ? AuthorLabel_1.AuthorLabel : ChannelLabel_1.ChannelLabel, colorHue: options[0] === 0 ? 240 : 266 }));
};
exports.MostProducerEmojis = MostProducerEmojis;
const MostReactionReceiver = ({ options }) => {
    const emojiStats = (0, BlockHook_1.useBlockData)("emoji/stats");
    return ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: options[0] === 0 ? "Author" : "Channel", unit: "# of reactions received", counts: emojiStats ? emojiStats.inReactions.counts[options[0] === 0 ? "authors" : "channels"] : undefined, maxItems: Math.min(15, Math.max((0, WorkerWrapper_1.getDatabase)().authors.length, (0, WorkerWrapper_1.getDatabase)().channels.length)), itemComponent: options[0] === 0 ? AuthorLabel_1.AuthorLabel : ChannelLabel_1.ChannelLabel, colorHue: options[0] === 0 ? 240 : 266 }));
};
exports.MostReactionReceiver = MostReactionReceiver;
///////////////////////////
/// DOMAINS
///////////////////////////
const DomainsIndexOf = (value) => (0, WorkerWrapper_1.getDatabase)().domains.indexOf(value);
const DomainsInFilter = (index, filter) => (0, WorkerWrapper_1.getDatabase)().domains[index].includes(filter);
const MostLinkedDomains = () => ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Domain", unit: "Times linked", counts: (0, BlockHook_1.useBlockData)("domains/stats")?.counts.domains, maxItems: Math.min(15, (0, WorkerWrapper_1.getDatabase)().domains.length), itemComponent: DomainLabel_1.DomainLabel, searchable: true, searchPlaceholder: "Filter domains...", indexOf: DomainsIndexOf, inFilter: DomainsInFilter }));
exports.MostLinkedDomains = MostLinkedDomains;
const MostLinks = ({ options }) => ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: options[0] === 0 ? "Author" : "Channel", unit: "Total links sent", counts: (0, BlockHook_1.useBlockData)("domains/stats")?.counts[options[0] === 0 ? "authors" : "channels"], itemComponent: options[0] === 0 ? AuthorLabel_1.AuthorLabel : ChannelLabel_1.ChannelLabel, maxItems: Math.min(15, options[0] === 0 ? (0, WorkerWrapper_1.getDatabase)().authors.length : (0, WorkerWrapper_1.getDatabase)().channels.length), colorHue: options[0] === 0 ? 240 : 266 }));
exports.MostLinks = MostLinks;
///////////////////////////
/// MENTIONS
///////////////////////////
const MentionsIndexOf = (value) => (0, WorkerWrapper_1.getFormatCache)().mentions.indexOf(value);
const MentionsInFilter = (index, filter) => (0, WorkerWrapper_1.getFormatCache)().mentions[index].includes(filter);
const MostMentioned = () => ((0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Who", unit: "Times mentioned", counts: (0, BlockHook_1.useBlockData)("interaction/stats")?.mentionsCount, itemComponent: MentionLabel_1.MentionLabel, maxItems: Math.min(15, (0, WorkerWrapper_1.getDatabase)().mentions.length), searchable: true, searchPlaceholder: "Filter @mentions...", indexOf: MentionsIndexOf, inFilter: MentionsInFilter }));
exports.MostMentioned = MostMentioned;
