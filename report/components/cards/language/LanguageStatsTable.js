"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Languages_1 = require("@pipeline/Languages");
const BlockHook_1 = require("@report/BlockHook");
const DottedTable_1 = __importDefault(require("@report/components/viz/DottedTable"));
const LanguageStatsTable = () => {
    const languageStats = (0, BlockHook_1.useBlockData)("language/stats");
    const lines = [
        {
            type: "number",
            formatter: "integer",
            label: "Total words used",
            value: languageStats?.totalWords,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Unique words used",
            value: languageStats?.uniqueWords,
        },
        {
            type: "number",
            formatter: "decimal",
            label: "Average words per message",
            value: languageStats?.avgWordsPerMessage,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Languages used",
            value: languageStats ? languageStats.languages.reduce((acc, lang) => acc + +(lang.index > 0), 0) : 0,
        },
        ...(languageStats?.languages.map((language) => ({
            type: "number",
            formatter: "integer",
            label: Languages_1.LanguageNames[language.index],
            value: language.value,
            depth: 1,
            tooltip: language.index === 0
                ? "Messages that did not have enough text to reliable detect the language"
                : undefined,
        })) ?? []),
    ];
    return (0, jsx_runtime_1.jsx)(DottedTable_1.default, { lines: lines });
};
exports.default = LanguageStatsTable;
