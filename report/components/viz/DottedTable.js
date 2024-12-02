"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_countup_1 = __importDefault(require("react-countup"));
const Tooltip_1 = require("@report/components/core/Tooltip");
const info_svg_1 = __importDefault(require("@assets/images/icons/info.svg"));
require("@assets/styles/DottedTable.less");
const numberFormatterFns = {
    integer: (n) => Math.round(n).toLocaleString(),
    decimal: (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    time: (n) => {
        // expected formats:
        // XXd XXh
        // XXh XXm
        // XXm XXs
        // XX seconds
        const days = Math.floor(n / (24 * 60 * 60));
        const hours = Math.floor((n % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((n % (60 * 60)) / 60);
        const seconds = Math.floor(n % 60);
        let result = "";
        let unitsShown = 0;
        if (days > 0) {
            result += days + "d ";
            unitsShown++;
        }
        if (hours > 0) {
            result += hours + "h ";
            unitsShown++;
        }
        if (unitsShown < 2 && minutes > 0) {
            result += minutes + "m ";
            unitsShown++;
        }
        if (unitsShown < 2 && seconds > 0) {
            result += seconds + (unitsShown > 0 ? "s" : " seconds");
            unitsShown++;
        }
        if (unitsShown === 0) {
            result += "0 seconds";
        }
        return result.trim();
    },
};
const LineItem = ({ line }) => {
    if (line.type === "separator") {
        return (0, jsx_runtime_1.jsx)("div", { className: "DottedTable__separator" });
    }
    else if (line.type === "title") {
        return (0, jsx_runtime_1.jsx)("span", { className: "DottedTable__title", title: line.label, children: line.label });
    }
    const depth = line.depth || 0;
    let value;
    switch (line.type) {
        case "text":
            value = (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: line.value });
            break;
        case "number":
            value = ((0, jsx_runtime_1.jsx)(react_countup_1.default, { end: line.value || 0, duration: 0.2, preserveValue: true, decimals: 2, formattingFn: typeof line.formatter === "string" ? numberFormatterFns[line.formatter] : line.formatter }));
            break;
    }
    const valueContainer = ((0, jsx_runtime_1.jsxs)("span", { className: "DottedTable__value", style: { fontWeight: depth === 0 ? "bold" : undefined }, children: [line.tooltip ? (0, jsx_runtime_1.jsx)("img", { src: info_svg_1.default, height: 16 }) : null, value] }));
    return ((0, jsx_runtime_1.jsxs)("li", { style: { paddingLeft: 20 * depth, color: depth === 1 ? "#c7c7c7" : undefined }, children: [(0, jsx_runtime_1.jsx)("span", { className: "DottedTable__label", title: line.label, children: line.label }), line.tooltip ? (0, jsx_runtime_1.jsx)(Tooltip_1.Tooltip, { content: line.tooltip, children: valueContainer }) : valueContainer] }));
};
const DottedTable = (props) => ((0, jsx_runtime_1.jsx)("div", { className: "DottedTable", children: (0, jsx_runtime_1.jsx)("ul", { children: props.lines.map((line, i) => ((0, jsx_runtime_1.jsx)(LineItem, { line: line }, i))) }) }));
exports.default = DottedTable;
