"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportInstructions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const PlatformInstructions_1 = require("@app/components/PlatformInstructions");
const Platforms_1 = require("@pipeline/Platforms");
const ExportInstructions = ({ platform }) => {
    const info = platform ? Platforms_1.PlatformsInfo[platform] : undefined;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ExportInstructions", children: ["You need to export the chats you want to analyze.", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("br", {}), "Follow these steps to export chats in", " ", (0, jsx_runtime_1.jsx)("span", { style: {
                    color: `hsl(${info?.color[0]}, ${info?.color[1]}%, ${info?.color[2]}%)`,
                }, children: info?.name }), ":", (0, jsx_runtime_1.jsx)("br", {}), PlatformInstructions_1.PlatformInstructions[platform]] }));
};
exports.ExportInstructions = ExportInstructions;
