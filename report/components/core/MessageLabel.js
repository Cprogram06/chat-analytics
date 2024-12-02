"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Attachments_1 = require("@pipeline/Attachments");
const Time_1 = require("@pipeline/Time");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const Tooltip_1 = require("@report/components/core/Tooltip");
const AuthorLabel_1 = require("@report/components/core/labels/AuthorLabel");
const ChannelLabel_1 = require("@report/components/core/labels/ChannelLabel");
const DomainLabel_1 = require("@report/components/core/labels/DomainLabel");
const EmojiLabel_1 = require("@report/components/core/labels/EmojiLabel");
const MentionLabel_1 = require("@report/components/core/labels/MentionLabel");
const WordLabel_1 = require("@report/components/core/labels/WordLabel");
require("@assets/styles/Labels.less");
const order = ["attachment", "link", "mention", "word", "emoji"];
const sortFn = (a, b) => {
    if (a.type === b.type) {
        // if type is the same, sort by count, then alphabetically
        if (a.count !== b.count)
            return b.count - a.count;
        return a.text && b.text ? a.text.localeCompare(b.text) : a.text ? 1 : -1;
    }
    else {
        // if type is different, sort by order
        return order.indexOf(a.type) - order.indexOf(b.type);
    }
};
const MessageLabel = (props) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const msg = props.message;
    if (msg === undefined) {
        return (0, jsx_runtime_1.jsx)("div", { className: "MessageLabel" });
    }
    const day = Time_1.Day.fromKey(db.time.minDate).nextDays(msg.dayIndex);
    const date = (0, Time_1.formatTime)("symd", day);
    const fullDateTime = (0, Time_1.formatTime)("ymdhms", day, msg.secondOfDay);
    const chips = []
        .concat(msg.attachments?.map((x) => ({ type: "attachment", index: x[0], count: x[1] })) || [], msg.words?.map((x) => ({ type: "word", index: x[0], count: x[1], text: db.words[x[0]] })) || [], msg.emojis?.map((x) => ({ type: "emoji", index: x[0], count: x[1] })) || [], 
    // prettier-ignore
    msg.mentions?.map(x => ({ type: "mention", index: x[0], count: x[1], text: db.mentions[x[0]] })) || [], msg.domains?.map((x) => ({ type: "link", index: x[0], count: x[1], text: db.domains[x[0]] })) || [])
        .sort(sortFn);
    const reactions = (msg.reactions || []).sort((a, b) => b[1] - a[1]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "MessageLabel", children: [(0, jsx_runtime_1.jsxs)("div", { className: "MessageLabel__main", children: [(0, jsx_runtime_1.jsxs)("div", { className: "MessageLabel__header", children: [(0, jsx_runtime_1.jsx)("div", { className: "MessageLabel__author", children: (0, jsx_runtime_1.jsx)(AuthorLabel_1.AuthorLabel, { index: msg.authorIndex }) }), (0, jsx_runtime_1.jsx)("span", { className: "MessageLabel__on", children: "on" }), (0, jsx_runtime_1.jsx)("div", { className: "MessageLabel__channel", children: (0, jsx_runtime_1.jsx)(ChannelLabel_1.ChannelLabel, { index: msg.channelIndex }) }), (0, jsx_runtime_1.jsx)(Tooltip_1.Tooltip, { content: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: fullDateTime }), children: (0, jsx_runtime_1.jsx)("div", { className: "MessageLabel__time", children: date }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "MessageLabel__chips", children: [chips.length === 0 && (0, jsx_runtime_1.jsx)("div", { className: "MessageLabel__empty", children: "No content found" }), chips.map((c, i) => ((0, jsx_runtime_1.jsx)(Chip, { chip: c }, i)))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "MessageLabel__reactions", children: reactions.map((r, i) => ((0, jsx_runtime_1.jsx)(Tooltip_1.Tooltip, { content: "reaction", children: (0, jsx_runtime_1.jsxs)("div", { className: "MessageLabel__reaction", children: [(0, jsx_runtime_1.jsx)(EmojiLabel_1.EmojiLabel, { index: r[0], hideNameIfPossible: true }), (0, jsx_runtime_1.jsx)("span", { className: "MessageLabel__reactionCount", children: r[1] })] }) }, i))) })] }));
};
exports.MessageLabel = MessageLabel;
const Chip = (props) => {
    const { type, index, count } = props.chip;
    let content = null;
    switch (type) {
        case "attachment":
            let kind = "unknown";
            // prettier-ignore
            switch (index) {
                case Attachments_1.AttachmentType.Image:
                    kind = "image";
                    break;
                case Attachments_1.AttachmentType.ImageAnimated:
                    kind = "GIF";
                    break;
                case Attachments_1.AttachmentType.Video:
                    kind = "video";
                    break;
                case Attachments_1.AttachmentType.Sticker:
                    kind = "sticker";
                    break;
                case Attachments_1.AttachmentType.Audio:
                    kind = "audio";
                    break;
                case Attachments_1.AttachmentType.Document:
                    kind = "document";
                    break;
                case Attachments_1.AttachmentType.Other:
                    kind = "other attachment";
                    break;
            }
            content = (0, jsx_runtime_1.jsx)("span", { className: "MessageLabel__attachment", children: kind });
            break;
        case "word":
            content = (0, jsx_runtime_1.jsx)(WordLabel_1.WordLabel, { index: index });
            break;
        case "emoji":
            content = (0, jsx_runtime_1.jsx)(EmojiLabel_1.EmojiLabel, { index: index, hideNameIfPossible: true });
            break;
        case "mention":
            content = (0, jsx_runtime_1.jsx)(MentionLabel_1.MentionLabel, { index: index });
            break;
        case "link":
            content = (0, jsx_runtime_1.jsx)(DomainLabel_1.DomainLabel, { index: index });
            break;
    }
    return ((0, jsx_runtime_1.jsx)(Tooltip_1.Tooltip, { content: type, children: (0, jsx_runtime_1.jsxs)("div", { className: ["MessageLabelChip", "MessageLabelChip--" + type].join(" "), children: [(0, jsx_runtime_1.jsx)("div", { className: "MessageLabelChip__content", children: content }), count > 1 && (0, jsx_runtime_1.jsx)("div", { className: "MessageLabelChip__count", children: count })] }) }));
};
