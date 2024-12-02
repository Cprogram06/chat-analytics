"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Landing_1 = require("@app/components/Landing");
const Steps_1 = require("@app/components/Steps");
const banner2_png_1 = __importDefault(require("@assets/images/logos/banner2.png"));
require("@assets/styles/HomePage.less");
const HomePage = () => {
    const [index, setIndex] = (0, react_1.useState)(0);
    // ain't pretty but it works
    const fireAnimation = () => {
        setIndex(1);
        setTimeout(() => setIndex(2), 200);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "HomePage", children: [(0, jsx_runtime_1.jsx)("header", { className: "HomePage__logo", children: (0, jsx_runtime_1.jsx)("a", { href: "/", children: (0, jsx_runtime_1.jsx)("img", { src: banner2_png_1.default, alt: "chatanalytics.app logo" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: ["HomePage__container", index > 0 ? "HomePage__container--fade-out" : ""].join(" "), style: { display: index >= 2 ? "none" : "block" }, "aria-hidden": index >= 2, children: (0, jsx_runtime_1.jsx)(Landing_1.Landing, { onStart: fireAnimation }) }), (0, jsx_runtime_1.jsx)("div", { className: ["HomePage__container", index >= 2 ? "HomePage__container--fade-in" : ""].join(" "), "aria-hidden": index < 2, style: { visibility: index < 2 ? "hidden" : "visible" }, children: (0, jsx_runtime_1.jsx)(Steps_1.Steps, {}) })] }));
};
exports.HomePage = HomePage;
