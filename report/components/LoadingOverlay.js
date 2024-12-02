"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const spinner_svg_1 = __importDefault(require("@assets/images/icons/spinner.svg"));
const banner_png_1 = __importDefault(require("@assets/images/logos/banner.png"));
const LoadingOverlay = (props) => ((0, jsx_runtime_1.jsxs)("div", { className: `LoadingOverlay ${props.loading ? "" : "LoadingOverlay--hidden"}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "LoadingOverlay__logo", children: (0, jsx_runtime_1.jsx)("img", { src: banner_png_1.default, alt: "chatanalytics.app logo" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "LoadingOverlay__spinner", children: [(0, jsx_runtime_1.jsx)("img", { src: spinner_svg_1.default, alt: "spinner" }), (0, jsx_runtime_1.jsx)("div", { children: "Decompressing data..." })] })] }));
exports.default = LoadingOverlay;
