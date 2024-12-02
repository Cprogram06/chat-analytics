"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
require("@assets/styles/Labels.less");
const BaseLabel = ({ title, name, avatar, leftIcon, rightIcon }) => {
    const content = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [avatar && (0, jsx_runtime_1.jsx)("div", { className: "Label__avatar", children: avatar }), leftIcon && (0, jsx_runtime_1.jsx)("div", { className: "Label__icon Label__icon--left", children: leftIcon }), name && (0, jsx_runtime_1.jsx)("span", { className: "Label__name", children: name }), rightIcon && (0, jsx_runtime_1.jsx)("div", { className: "Label__icon Label__icon--right", children: rightIcon })] }));
    return (0, jsx_runtime_1.jsx)("div", { className: "Label", title: title, children: content });
};
exports.BaseLabel = BaseLabel;
