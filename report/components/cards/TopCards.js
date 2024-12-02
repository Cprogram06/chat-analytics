"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopReacted = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const BlockHook_1 = require("@report/BlockHook");
const TopMessages_1 = require("@report/components/viz/TopMessages");
const EmptyArray = [];
const TopReactedTitleFns = {
    "0": (msg) => `${msg.reactions.reduce((acc, cur) => acc + cur[1], 0).toLocaleString()} reactions in total from ${msg.reactions.length} emoji`,
    "1": (msg) => `${msg.reactions.reduce((acc, cur) => Math.max(acc, cur[1]), 0).toLocaleString()} reactions in a single emoji`,
};
const TopReacted = ({ options }) => {
    const interactionStats = (0, BlockHook_1.useBlockData)("interaction/stats");
    return ((0, jsx_runtime_1.jsx)(TopMessages_1.TopMessages, { messages: interactionStats
            ? options[0] === 0
                ? interactionStats.topTotalReactions
                : interactionStats.topSingleReactions
            : EmptyArray, title: TopReactedTitleFns[options[0]] }));
};
exports.TopReacted = TopReacted;
