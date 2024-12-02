"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BlockHook_1 = require("@report/BlockHook");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const LoadingGroup_1 = require("@report/components/LoadingGroup");
const WordCloud_1 = __importDefault(require("@report/components/cards/language/WordCloud"));
const WordStats_1 = __importDefault(require("@report/components/cards/language/WordStats"));
const WordLabel_1 = require("@report/components/core/labels/WordLabel");
const MostUsed_1 = __importDefault(require("@report/components/viz/MostUsed"));
require("@assets/styles/WordsCard.less");
const WordsIndexOf = (value) => (0, WorkerWrapper_1.getFormatCache)().words.indexOf(value);
const WordsInFilter = (index, filter) => {
    const word = (0, WorkerWrapper_1.getFormatCache)().words[index];
    return filter instanceof RegExp ? filter.test(word) : word.startsWith(filter);
};
const WordsUsage = ({ options }) => {
    const languageStats = (0, BlockHook_1.useBlockData)("language/stats");
    const [selectedWord, setSelectedWord] = (0, react_1.useState)({
        index: -1,
        manual: false,
    });
    if (options[0] === 1)
        return (0, jsx_runtime_1.jsx)(WordCloud_1.default, { wordsCount: languageStats?.wordsCount });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "WordsCard", children: [(0, jsx_runtime_1.jsx)(MostUsed_1.default, { what: "Word", unit: "Times used", counts: languageStats?.wordsCount, maxItems: Math.min(15, (0, WorkerWrapper_1.getDatabase)().words.length), itemComponent: WordLabel_1.WordLabel, searchable: true, allowRegex: true, searchPlaceholder: "Filter words...", indexOf: WordsIndexOf, inFilter: WordsInFilter, selectable: true, selected: selectedWord, onSelectChange: setSelectedWord }), (0, jsx_runtime_1.jsx)(LoadingGroup_1.LoadingGroup, { children: (state) => ((0, jsx_runtime_1.jsxs)("div", { className: "WordsCard__group " + (state !== "ready" ? "WordsCard__loading" : ""), children: [(0, jsx_runtime_1.jsx)(WordStats_1.default, { wordIndex: selectedWord.index }), (0, jsx_runtime_1.jsx)("div", { className: "WordsCard__overlay" })] })) })] }));
};
exports.default = WordsUsage;
