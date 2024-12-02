"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const BaseLabel_1 = require("@report/components/core/labels/BaseLabel");
const _EmojiLabel = ({ index, hideNameIfPossible }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const emoji = db.emojis[index];
    let name;
    let symbol;
    let image;
    if (emoji.type === "unicode") {
        name = emoji.name;
        symbol = emoji.symbol;
    }
    else {
        name = `:${emoji.name}:`;
        if (emoji.id !== undefined) {
            // the only emojis with IDs right now are Discord emojis
            image = (0, jsx_runtime_1.jsx)("img", { src: `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=32`, height: 16 });
        }
    }
    const showName = name !== symbol && (!hideNameIfPossible || (symbol === undefined && image === null));
    const icon = image ? image : (0, jsx_runtime_1.jsx)("span", { style: { color: "#b9b9b9" }, children: symbol });
    return (0, jsx_runtime_1.jsx)(BaseLabel_1.BaseLabel, { title: emoji.name, leftIcon: icon, name: showName ? name : undefined });
};
exports.EmojiLabel = (0, react_1.memo)(_EmojiLabel);
