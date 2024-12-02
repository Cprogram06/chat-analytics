"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Platforms_1 = require("@pipeline/Platforms");
const BlockHook_1 = require("@report/BlockHook");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const DottedTable_1 = __importDefault(require("@report/components/viz/DottedTable"));
const EmojiStatsTable = () => {
    const emojiStats = (0, BlockHook_1.useBlockData)("emoji/stats");
    const db = (0, WorkerWrapper_1.getDatabase)();
    const platformInfo = Platforms_1.PlatformsInfo[db.config.platform];
    const reactionSupportTooltip = platformInfo.support.reactions
        ? undefined
        : platformInfo.name + " does not support reactions or the information is not present in export files";
    const lines = [
        {
            type: "number",
            formatter: "integer",
            label: "Total emoji used in text",
            value: emojiStats ? emojiStats.inText.regular + emojiStats.inText.custom : 0,
        },
        {
            type: "number",
            formatter: "integer",
            depth: 1,
            label: "regular emoji (❤)",
            value: emojiStats?.inText.regular,
        },
        {
            type: "number",
            formatter: "integer",
            depth: 1,
            label: "custom emoji (:pepe:)",
            value: emojiStats?.inText.custom,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Unique emoji used in text",
            value: emojiStats?.inText.unique,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Messages with at least one emoji in text",
            value: emojiStats?.inText.messagesWithAtLeastOneEmoji,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Total emoji used in reactions",
            value: emojiStats ? emojiStats.inReactions.regular + emojiStats.inReactions.custom : 0,
            tooltip: reactionSupportTooltip,
        },
        /*
        {
            type: "number",
            formatter: "integer",
            depth: 1,
            label: "regular emoji (❤)",
            value: data?.inReactions.regular,
            tooltip: reactionSupportTooltip
        },
        {
            type: "number",
            formatter: "integer",
            depth: 1,
            label: "custom emoji (:pepe:)",
            value: data?.inReactions.custom,
            tooltip: reactionSupportTooltip
        },
        */
        {
            type: "number",
            formatter: "integer",
            label: "Unique emoji used in reactions",
            value: emojiStats?.inReactions.unique,
            tooltip: reactionSupportTooltip,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Messages with at least one emoji reacted",
            value: emojiStats?.inReactions.messagesWithAtLeastOneEmoji,
            tooltip: reactionSupportTooltip,
        },
    ];
    return (0, jsx_runtime_1.jsx)(DottedTable_1.default, { lines: lines });
};
exports.default = EmojiStatsTable;
