"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartLink = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const refresh_svg_1 = __importDefault(require("@assets/images/icons/refresh.svg"));
const RestartLink = ({ text }) => ((0, jsx_runtime_1.jsxs)("a", { href: "/", className: "RestartLink", children: [(0, jsx_runtime_1.jsx)("img", { src: refresh_svg_1.default, alt: "Refresh" }), text] }));
exports.RestartLink = RestartLink;
