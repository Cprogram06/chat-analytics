"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const BlockHook_1 = require("@report/BlockHook");
const SentimentPieChart_1 = __importDefault(require("@report/components/cards/sentiment/SentimentPieChart"));
const DottedTable_1 = __importDefault(require("@report/components/viz/DottedTable"));
const SentimentStatsTable = () => {
    const sentimentStats = (0, BlockHook_1.useBlockData)("sentiment/stats");
    const lines = [
        {
            type: "number",
            formatter: "integer",
            label: "Positive messages",
            value: sentimentStats?.positiveMessages,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Negative messages",
            value: sentimentStats?.negativeMessages,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Neutral messages",
            value: sentimentStats?.neutralMessages,
        },
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DottedTable_1.default, { lines: lines }), (0, jsx_runtime_1.jsx)(SentimentPieChart_1.default, { n: sentimentStats?.negativeMessages || 0, p: sentimentStats?.positiveMessages || 0, z: sentimentStats?.neutralMessages || 0 })] }));
};
exports.default = SentimentStatsTable;
