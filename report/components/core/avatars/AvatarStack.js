"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarStack = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const TextAvatar_1 = require("@report/components/core/avatars/TextAvatar");
require("@assets/styles/Avatars.less");
const AvatarStack = ({ avatars, limit }) => {
    let left = 0;
    if (limit !== undefined) {
        left = avatars.length - limit;
        avatars = avatars.slice(0, limit);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "AvatarStack", children: [avatars.map((item, i) => ((0, jsx_runtime_1.jsx)("div", { className: "AvatarStack__item", children: item }, i))), left > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "AvatarStack__item", children: (0, jsx_runtime_1.jsx)(TextAvatar_1.TextAvatar, { text: `... +${left}`, color: "white", background: "#6d7071" }) }))] }));
};
exports.AvatarStack = AvatarStack;
