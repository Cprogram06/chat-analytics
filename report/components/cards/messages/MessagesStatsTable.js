"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Attachments_1 = require("@pipeline/Attachments");
const Platforms_1 = require("@pipeline/Platforms");
const Time_1 = require("@pipeline/Time");
const BlockHook_1 = require("@report/BlockHook");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const DottedTable_1 = __importDefault(require("@report/components/viz/DottedTable"));
const MessagesStatsTable = () => {
    const stats = (0, BlockHook_1.useBlockData)("messages/stats");
    const duration = (0, BlockHook_1.useBlockData)("interaction/conversation-duration");
    const db = (0, WorkerWrapper_1.getDatabase)();
    const platformInfo = Platforms_1.PlatformsInfo[db.config.platform];
    const lines = [
        {
            type: "number",
            formatter: "integer",
            label: "Total messages sent",
            value: stats?.total,
        },
        {
            type: "number",
            formatter: "integer",
            label: "✏️ with text",
            depth: 1,
            value: stats?.withText,
        },
        {
            type: "number",
            formatter: "integer",
            label: "🔗 with links",
            depth: 1,
            value: stats?.withLinks,
        },
        {
            type: "number",
            formatter: "integer",
            label: "📷 with images",
            depth: 1,
            value: stats?.withAttachmentsCount[Attachments_1.AttachmentType.Image],
        },
        {
            type: "number",
            formatter: "integer",
            label: "👾 with GIFs",
            depth: 1,
            value: stats?.withAttachmentsCount[Attachments_1.AttachmentType.ImageAnimated],
        },
        {
            type: "number",
            formatter: "integer",
            label: "📹 with videos",
            depth: 1,
            value: stats?.withAttachmentsCount[Attachments_1.AttachmentType.Video],
        },
        {
            type: "number",
            formatter: "integer",
            label: "🎉 with stickers",
            depth: 1,
            value: stats?.withAttachmentsCount[Attachments_1.AttachmentType.Sticker],
            tooltip: platformInfo.support.stickers
                ? undefined
                : platformInfo.name + " does not support stickers or the information is not present in export files",
        },
        {
            type: "number",
            formatter: "integer",
            label: "🎵 with audio files",
            depth: 1,
            value: stats?.withAttachmentsCount[Attachments_1.AttachmentType.Audio],
        },
        {
            type: "number",
            formatter: "integer",
            label: "📄 with documents",
            depth: 1,
            value: stats?.withAttachmentsCount[Attachments_1.AttachmentType.Document],
        },
        {
            type: "number",
            formatter: "integer",
            label: "📁 with other files",
            depth: 1,
            value: stats?.withAttachmentsCount[Attachments_1.AttachmentType.Other],
        },
        {
            type: "number",
            formatter: "integer",
            label: "Edited messages",
            value: stats?.edited,
            tooltip: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("b", { children: [stats ? ((stats.edited / stats.total) * 100).toFixed(2) : "-", "%"] }), " of total messages were edited"] })),
        },
        {
            type: "number",
            formatter: "decimal",
            label: "Average messages per day",
            value: stats ? stats.total / stats.numActiveDays : undefined,
        },
        {
            type: "number",
            formatter: "time",
            label: "Longest period without messages",
            value: duration && duration.longestTimeWithoutMessages
                ? duration.longestTimeWithoutMessages.minutes * 60
                : undefined,
            tooltip: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Longest inactivity period:", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("b", { children: ["from ", (0, Time_1.formatDatetime)("ymdhm", duration?.longestTimeWithoutMessages?.start), (0, jsx_runtime_1.jsx)("br", {}), "to ", (0, Time_1.formatDatetime)("ymdhm", duration?.longestTimeWithoutMessages?.end)] }), (0, jsx_runtime_1.jsx)("br", {}), "(rounded to 5 minutes)"] })),
        },
        {
            type: "number",
            formatter: "time",
            label: "Longest active conversation",
            value: duration && duration.longestActiveConversation
                ? duration.longestActiveConversation.minutes * 60
                : undefined,
            tooltip: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Longest active conversation:", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("b", { children: ["from ", (0, Time_1.formatDatetime)("ymdhm", duration?.longestActiveConversation?.start), (0, jsx_runtime_1.jsx)("br", {}), "to ", (0, Time_1.formatDatetime)("ymdhm", duration?.longestActiveConversation?.end)] }), (0, jsx_runtime_1.jsx)("br", {}), "(rounded to 5 minutes)", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("b", { children: "\u2753 Active conversation:" }), " considered still active if the time between the previous and next message is less than 10 minutes. Makes more sense when filtering by a single channel."] })),
        },
        {
            type: "separator",
        },
        {
            type: "title",
            label: "Most active...",
        },
        {
            type: "text",
            label: "year ever",
            depth: 1,
            value: (0, Time_1.formatDatetime)("y", stats?.mostActive.year.at),
            tooltip: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["with ", stats?.mostActive.year.messages.toLocaleString(), " messages"] }),
        },
        {
            type: "text",
            label: "month ever",
            depth: 1,
            value: (0, Time_1.formatDatetime)("ym", stats?.mostActive.month.at),
            tooltip: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["with ", stats?.mostActive.month.messages.toLocaleString(), " messages"] }),
        },
        {
            type: "text",
            label: "day ever",
            depth: 1,
            value: (0, Time_1.formatDatetime)("ymd", stats?.mostActive.day.at),
            tooltip: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["with ", stats?.mostActive.day.messages.toLocaleString(), " messages"] }),
        },
        {
            type: "text",
            label: "hour ever",
            depth: 1,
            value: (0, Time_1.formatDatetime)("ymdh", stats?.mostActive.hour.at),
            tooltip: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["with ", stats?.mostActive.hour.messages.toLocaleString(), " messages"] }),
        },
    ];
    return (0, jsx_runtime_1.jsx)(DottedTable_1.default, { lines: lines });
};
exports.default = MessagesStatsTable;
