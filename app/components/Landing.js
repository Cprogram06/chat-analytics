"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Landing = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button_1 = require("@app/components/Button");
const Platforms_1 = require("@pipeline/Platforms");
const PlatformLogos_1 = require("@assets/PlatformLogos");
const lock_svg_1 = __importDefault(require("@assets/images/icons/lock.svg"));
require("@assets/styles/Landing.less");
const Landing = ({ onStart }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "Landing", children: [(0, jsx_runtime_1.jsx)("h1", { className: "Landing__title", children: "Generate interactive, beautiful and insightful chat analysis reports" }), (0, jsx_runtime_1.jsxs)("div", { className: "Landing__desc", children: [(0, jsx_runtime_1.jsxs)("div", { className: "Landing__sameline", children: [(0, jsx_runtime_1.jsx)("p", { className: "Landing__browser", children: "Everything is processed in your browser." }), (0, jsx_runtime_1.jsxs)("span", { className: "Landing__secure", children: [(0, jsx_runtime_1.jsx)("img", { src: lock_svg_1.default, alt: "Lock" }), (0, jsx_runtime_1.jsx)("p", { children: "No data leaves your device." })] })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("p", { children: ["Can handle millions of messages and multiple chats. ", (0, jsx_runtime_1.jsx)("b", { children: "Free and open source \u2764\uFE0F" })] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("div", { className: "Landing__platforms-line", children: [(0, jsx_runtime_1.jsx)("span", { children: "Supports" }), Object.entries(Platforms_1.PlatformsInfo).map(([key, p]) => ((0, jsx_runtime_1.jsx)("div", { className: "Landing__platform", style: {
                                    backgroundColor: `hsl(${p.color[0]}, ${p.color[1]}%, ${p.color[2]}%)`,
                                }, children: PlatformLogos_1.PlatformLogos[key] }, key)))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "Landing__buttons", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { hueColor: [258, 90, 61], className: "Landing__cta", onClick: onStart, children: "Generate a report" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { hueColor: [244, 90, 61], href: env.isDev ? "/report.html" : "/demo", target: "_blank", children: "View Demo" })] })] }));
};
exports.Landing = Landing;
