"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const LazyImage_1 = require("@report/components/core/LazyImage");
const BaseLabel_1 = require("@report/components/core/labels/BaseLabel");
const default_favicon_png_1 = __importDefault(require("@assets/images/icons/default-favicon.png"));
const link_out_blue_svg_1 = __importDefault(require("@assets/images/icons/link-out-blue.svg"));
const DefaultFavicon = (0, jsx_runtime_1.jsx)("img", { src: default_favicon_png_1.default, width: 16, height: 16 });
const _DomainLabel = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const domain = db.domains[index];
    // NOTE: we use the icon provided by DuckDuckGo:
    // https://icons.duckduckgo.com/ip3/google.com.ico
    // we could also use the icon provided by Google:
    // https://www.google.com/s2/favicons?domain=google.com
    // but you know... privacy
    const domainIcon = ((0, jsx_runtime_1.jsx)("div", { style: { width: 16, height: 16 }, children: (0, jsx_runtime_1.jsx)(LazyImage_1.LazyImage, { src: `https://icons.duckduckgo.com/ip3/${domain}.ico`, placeholder: DefaultFavicon }) }));
    const linkoutIcon = (0, jsx_runtime_1.jsx)("img", { src: link_out_blue_svg_1.default, width: 12, height: 12 });
    return ((0, jsx_runtime_1.jsx)("a", { className: "Label", href: `http://${domain}`, target: "_blank", rel: "noopener noreferrer", children: (0, jsx_runtime_1.jsx)(BaseLabel_1.BaseLabel, { title: domain, leftIcon: domainIcon, name: domain, rightIcon: linkoutIcon }) }));
};
exports.DomainLabel = (0, react_1.memo)(_DomainLabel);
