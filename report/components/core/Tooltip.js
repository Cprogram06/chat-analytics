"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("@tippyjs/react"));
require("@assets/styles/Tooltip.less");
const Tooltip = ({ content, placement, children }) => {
    const wrapper = (0, jsx_runtime_1.jsx)("div", { style: { textAlign: "center" }, children: content });
    return (0, jsx_runtime_1.jsx)(react_1.default, { content: wrapper, placement: placement, children: children, theme: "translucent" });
};
exports.Tooltip = Tooltip;
