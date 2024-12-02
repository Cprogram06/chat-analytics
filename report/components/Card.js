"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ErrorBoundary_1 = __importDefault(require("@report/components/ErrorBoundary"));
const LoadingGroup_1 = require("@report/components/LoadingGroup");
const Tooltip_1 = require("@report/components/core/Tooltip");
const info_svg_1 = __importDefault(require("@assets/images/icons/info.svg"));
require("@assets/styles/Card.less");
const Card = (props) => {
    const Content = (pp) => {
        const { state } = pp;
        // normalize title, make sure it's an array
        const title = typeof props.title === "string" ? [props.title] : props.title;
        // by default all options are 0
        const [options, setOptions] = (0, react_1.useState)(props.defaultOptions || title.filter((a) => typeof a !== "string").map((_) => 0));
        const elements = [];
        let optionIndex = 0;
        for (const entry of title) {
            if (typeof entry === "string") {
                // raw text
                elements.push((0, jsx_runtime_1.jsx)("span", { children: entry }, entry));
            }
            else {
                // select with options
                const localOptionIndex = optionIndex;
                elements.push(
                // use first option as key
                (0, jsx_runtime_1.jsx)("select", { value: options[localOptionIndex], onChange: (e) => setOptions((prev) => {
                        const newOptions = [...prev];
                        newOptions[localOptionIndex] = parseInt(e.target.value);
                        return newOptions;
                    }), children: entry.map((o, i) => ((0, jsx_runtime_1.jsx)("option", { value: i, children: o }, i))) }, entry[0]));
                optionIndex++;
            }
        }
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(ErrorBoundary_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "Card__overlay" +
                            (state === "ready"
                                ? " Card__overlay--hidden"
                                : state === "error"
                                    ? " Card__overlay--error"
                                    : "") }), state === "error" && ((0, jsx_runtime_1.jsx)("div", { className: "Card__error", children: "Error occurred, please check the console for more details" })), (0, jsx_runtime_1.jsxs)("div", { className: "Card__title Card__title--" + state, children: [elements, props.tooltip ? ((0, jsx_runtime_1.jsx)(Tooltip_1.Tooltip, { content: props.tooltip, children: (0, jsx_runtime_1.jsx)("img", { src: info_svg_1.default, height: 16, style: { marginTop: 2 } }) })) : null] }), (0, jsx_runtime_1.jsx)("div", { className: state === "ready" ? "" : "Card__gray", children: (0, jsx_runtime_1.jsx)(props.children, { options: options }) })] }) }));
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "Card Card--" + props.num, children: (0, jsx_runtime_1.jsx)(LoadingGroup_1.LoadingGroup, { children: (state) => (0, jsx_runtime_1.jsx)(Content, { state: state }) }) }));
};
exports.default = Card;
