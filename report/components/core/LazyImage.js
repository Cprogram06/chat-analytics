"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyImage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// NOTE: store loading status to avoid flickering in some conditions
// NOTE: it assumes that "Disable cache" is not enabled (no problem if devtools are closed)
// ok: loaded correctly, image in cache
// error: failed to load, remove img
// undefined: loading, keep the img with opacity 0 so onLoad and onError fire
const loadStatus = {};
const LazyImage = ({ src, placeholder }) => {
    // convenient to allow src to be undefined
    if (src === undefined)
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: placeholder });
    const [_, ping] = (0, react_1.useState)(0);
    const onLoad = () => {
        loadStatus[src] = "ok";
        ping(Date.now());
    };
    const onError = () => {
        loadStatus[src] = "error";
        ping(Date.now());
    };
    const status = loadStatus[src];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [status !== "ok" && placeholder, status !== "error" && ((0, jsx_runtime_1.jsx)("img", { className: "LazyImage", style: { opacity: status === "ok" ? undefined : 0 }, loading: "lazy", src: src, onError: status === undefined ? onError : undefined, onLoad: status === undefined ? onLoad : undefined }))] }));
};
exports.LazyImage = LazyImage;
