"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAvatar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const TextAvatar = ({ text, color, background, useInitials }) => {
    if (useInitials !== undefined) {
        const parts = text.split(" ");
        const keepParts = parts.slice(0, useInitials);
        let initials = "";
        for (const part of keepParts) {
            // iterate UTF-8 codepoints
            for (const symbol of part) {
                // store frist
                initials += symbol;
                break;
            }
        }
        text = initials;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "Avatar", children: (0, jsx_runtime_1.jsx)("div", { className: "TextAvatar", style: {
                color,
                background,
            }, children: text }) }));
};
exports.TextAvatar = TextAvatar;
