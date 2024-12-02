"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fs = __importStar(require("fs"));
const react_1 = require("react");
const BlockHook_1 = require("@report/BlockHook");
const ErrorBoundary_1 = __importDefault(require("@report/components/ErrorBoundary"));
const LoadingGroup_1 = require("@report/components/LoadingGroup");
const Tooltip_1 = require("@report/components/core/Tooltip");
const AuthorLabel_1 = require("@report/components/core/labels/AuthorLabel");
const info_svg_1 = __importDefault(require("@assets/images/icons/info.svg"));
require("@assets/styles/ScrollableCard.less");
const ScrollableCard = (props) => {
    const Content = (pp) => {
        const { state } = pp;
        // normalize title, make sure it's an array
        const title = typeof props.title === "string" ? [props.title] : props.title;
        // by default all options are 0
        const [options, setOptions] = (0, react_1.useState)(props.defaultOptions || title.filter((a) => typeof a !== "string").map((_) => 0));
        const handleExportClick = () => {
            // Implement your export logic here
            // This function should include code to export the data or perform the desired export action
            console.log("Exporting data...");
            // Create CSV content
            const csvContent = `Author,Positive Messages,Negative Messages\n${AuthorLabel_1.AuthorLabel},${(0, BlockHook_1.useBlockData)("messages/stats")?.counts.positiveMessages},${(0, BlockHook_1.useBlockData)("messages/stats")?.counts.negativeMessages}`;
            // Save CSV content to a file
            const filePath = "data.csv";
            fs.writeFile(filePath, csvContent, "utf8", (error) => {
                if (error) {
                    console.error("Error:", error);
                }
                else {
                    console.log(`CSV file saved to ${filePath}`);
                }
            });
            // Add your export logic here
        };
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
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(ErrorBoundary_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "ScrollableCard__overlay" +
                            (state === "ready"
                                ? " ScrollableCard__overlay--hidden"
                                : state === "error"
                                    ? " ScrollableCard__overlay--error"
                                    : "") }), state === "error" && ((0, jsx_runtime_1.jsx)("div", { className: "ScrollableCard__error", children: "Error occurred, please check the console for more details" })), (0, jsx_runtime_1.jsxs)("div", { className: `ScrollableCard__title ScrollableCard__title--${state}`, children: [elements, props.tooltip ? ((0, jsx_runtime_1.jsx)(Tooltip_1.Tooltip, { content: props.tooltip, children: (0, jsx_runtime_1.jsx)("img", { src: info_svg_1.default, height: 16, style: { marginTop: 2 } }) })) : null] }), (0, jsx_runtime_1.jsx)("div", { className: `ScrollableCard__content ${state === "ready" ? "" : "ScrollableCard__gray"}`, style: { maxHeight: "680px", overflowY: "auto" }, children: (0, jsx_runtime_1.jsx)("div", { className: "custom-scrollbar", children: (0, jsx_runtime_1.jsx)(props.children, { options: options }) }) })] }) }));
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: `ScrollableCard ScrollableCard--${props.num}`, children: (0, jsx_runtime_1.jsx)(LoadingGroup_1.LoadingGroup, { children: (state) => (0, jsx_runtime_1.jsx)(Content, { state: state }) }) }));
};
exports.default = ScrollableCard;
