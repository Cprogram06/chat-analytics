"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_countup_1 = __importDefault(require("react-countup"));
require("@assets/styles/AnimatedBars.less");
const ITEM_STRIDE = 40;
const HEADER_HEIGHT = 27; // hmmm
const defaultFormatting = (n) => n.toLocaleString();
const Item = (props) => ((0, jsx_runtime_1.jsxs)("div", { className: "AnimatedBars__item", style: { top: props.rank * ITEM_STRIDE + "px", cursor: props.selectable ? "pointer" : "default" }, onClick: () => props.onSelectChange && props.onSelectChange({ index: props.entry.index, manual: true }), children: [(0, jsx_runtime_1.jsx)("div", { className: "AnimatedBars__bar", style: {
                width: props.percent + "%",
                backgroundColor: props.selected
                    ? `#2f8f79`
                    : props.colorHue === undefined
                        ? `rgba(255, 255, 255, 0.1)`
                        : `hsl(${props.colorHue}, 100%, 65%)`,
            } }), (0, jsx_runtime_1.jsx)("div", { className: "AnimatedBars__value", children: (0, jsx_runtime_1.jsx)(props.itemComponent, { index: props.entry.index, pin: props.entry.pin || false }) }), (0, jsx_runtime_1.jsx)(react_countup_1.default, { className: "AnimatedBars__unit", preserveValue: true, delay: 0, duration: 0.5, end: props.entry.value, formattingFn: props.formatNumber })] }));
const AnimatedBars = (props) => {
    const sortedById = props.data.slice().sort((a, b) => (a.index > b.index ? 1 : -1));
    const sortedByValue = props.data
        .slice()
        .sort((a, b) => (a.pin === b.pin ? b.value - a.value : +(b.pin || 0) - +(a.pin || 0)));
    const maxValue = props.maxValue !== undefined
        ? props.maxValue
        : sortedByValue.reduce((max, entry) => Math.max(max, entry.value), 0);
    (0, react_1.useEffect)(() => {
        if (!props.selectable)
            return;
        if (props.onSelectChange === undefined)
            return;
        if (sortedByValue.length === 0)
            return; // no item to select
        const topEntry = sortedByValue[0];
        const selected = sortedByValue.find((entry) => entry.index === props.selected?.index);
        if (
        // selection lost
        // reset selection to the first item
        selected === undefined ||
            // change selection ONLY IF the current selection has not been set manually
            (props.selected && props.selected.manual === false)) {
            if (topEntry !== selected)
                // and don't change if dont have to (avoid infinite loop)
                props.onSelectChange({
                    index: topEntry.index,
                    manual: false,
                });
        }
    }, [props.data, props.selected]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "AnimatedBars", style: { minHeight: ITEM_STRIDE * props.maxItems + HEADER_HEIGHT }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "AnimatedBars__header", children: [(0, jsx_runtime_1.jsx)("div", { children: props.what }), (0, jsx_runtime_1.jsx)("div", { children: props.unit })] }), (0, jsx_runtime_1.jsx)("div", { className: "AnimatedBars__body", style: { minHeight: ITEM_STRIDE * sortedById.length }, children: sortedById.map((entry) => ((0, jsx_runtime_1.jsx)(Item, { entry: entry, rank: sortedByValue.indexOf(entry), percent: Math.max((entry.value / maxValue) * 100, 1), itemComponent: props.itemComponent, colorHue: props.colorHue, formatNumber: props.formatNumber || defaultFormatting, selectable: props.selectable === true, selected: props.selected?.index === entry.index, onSelectChange: props.onSelectChange }, entry.index))) }), (0, jsx_runtime_1.jsx)("div", { className: "AnimatedBars__footer", children: sortedById.length === 0
                    ? "No data to show"
                    : sortedById.length < props.maxItems
                        ? "No more entries to show"
                        : undefined })] }));
};
exports.default = AnimatedBars;
