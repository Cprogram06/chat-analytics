"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopMessages = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const MessageLabel_1 = require("@report/components/core/MessageLabel");
require("@assets/styles/TopMessages.less");
const TopMessages = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [props.messages.map((msg, i) => ((0, jsx_runtime_1.jsx)(TopMessage, { msg: msg, i: i, title: props.title }, i))), props.messages.length === 0 && (0, jsx_runtime_1.jsx)("div", { className: "TopMessages__empty", children: "No data to show" })] }));
};
exports.TopMessages = TopMessages;
const TopMessage = ({ msg, i, title }) => ((0, jsx_runtime_1.jsxs)("div", { className: "TopMessage", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("span", { className: "TopMessage__pos", children: ["#", i + 1] }), title(msg)] }), (0, jsx_runtime_1.jsx)(MessageLabel_1.MessageLabel, { message: msg })] }));
