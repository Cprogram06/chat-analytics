"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BlockHook_1 = require("@report/BlockHook");
const AuthorLabel_1 = require("@report/components/core/labels/AuthorLabel");
const ChannelLabel_1 = require("@report/components/core/labels/ChannelLabel");
const AnimatedBars_1 = __importDefault(require("@report/components/viz/AnimatedBars"));
const formatPercent = (value) => `${value.toFixed(0)}%`;
const EditedMessages = ({ options }) => {
    const msgEdited = (0, BlockHook_1.useBlockData)("messages/edited");
    const msgStats = (0, BlockHook_1.useBlockData)("messages/stats");
    const key = options[0] === 0 ? "authors" : "channels";
    const computed = (0, react_1.useMemo)(() => {
        if (msgEdited === undefined || msgStats === undefined) {
            return {
                byCount: [],
                byPercent: [],
            };
        }
        return {
            byCount: msgEdited.count[key]
                .map((value, index) => ({
                index,
                value,
            }))
                .filter((a) => a.value > 0) // filter out 0 edits
                .sort((a, b) => b.value - a.value)
                .slice(0, 5),
            byPercent: msgEdited.count[key]
                .map((value, index) => ({
                index,
                value: (value / msgStats.counts[key][index]) * 100,
            }))
                .filter((entry) => msgStats.counts[key][entry.index] > 100) // filter out less than 100 messages
                .filter((entry) => entry.value > 0) // filter out 0% edits
                .sort((a, b) => b.value - a.value)
                .slice(0, 5),
        };
    }, [key, msgEdited, msgStats]);
    const what = options[0] === 0 ? "Author" : "Channel";
    const itemComponent = options[0] === 0 ? AuthorLabel_1.AuthorLabel : ChannelLabel_1.ChannelLabel;
    const maxItems = 5;
    const colorHue = options[0] === 0 ? 240 : 266;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AnimatedBars_1.default, { what: what, unit: "# of messages edited \u270F\uFE0F", data: computed.byCount, itemComponent: itemComponent, maxItems: maxItems, colorHue: colorHue }), (0, jsx_runtime_1.jsx)(AnimatedBars_1.default, { what: what, unit: "% of messages edited \u270F\uFE0F", data: computed.byPercent, itemComponent: itemComponent, maxItems: maxItems, colorHue: colorHue, maxValue: 100, formatNumber: formatPercent })] }));
};
exports.default = EditedMessages;
