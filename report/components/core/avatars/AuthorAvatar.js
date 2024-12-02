"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorAvatar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const LazyImage_1 = require("@report/components/core/LazyImage");
const Telegram_1 = require("@report/components/core/avatars/Telegram");
const TextAvatar_1 = require("@report/components/core/avatars/TextAvatar");
const author_avatar_0_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/author_avatar_0.png"));
const author_avatar_1_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/author_avatar_1.png"));
const author_avatar_2_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/author_avatar_2.png"));
const author_avatar_3_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/author_avatar_3.png"));
const author_avatar_4_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/author_avatar_4.png"));
const default_avatar_png_1 = __importDefault(require("@assets/images/platforms/messenger/default_avatar.png"));
const avatar_placeholder_png_1 = __importDefault(require("@assets/images/platforms/whatsapp/avatar_placeholder.png"));
const DiscordDefaultDMAvatars = [
    author_avatar_0_png_1.default,
    author_avatar_1_png_1.default,
    author_avatar_2_png_1.default,
    author_avatar_3_png_1.default,
    author_avatar_4_png_1.default,
];
const RawImg = (src) => ((0, jsx_runtime_1.jsx)("img", { src: src, style: {
        width: "100%",
        height: "100%",
    } }));
const AuthorAvatar = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const platform = db.config.platform;
    const author = db.authors[index];
    let url;
    let placeholder;
    switch (platform) {
        case "discord":
            let discriminator = 0;
            const num = author.n.split("#").pop();
            if (num && num.length === 4)
                discriminator = parseInt(num);
            url = author.a ? `https://cdn.discordapp.com/avatars/${author.a}.png?size=64` : undefined;
            placeholder = RawImg(DiscordDefaultDMAvatars[discriminator % 5]);
            break;
        case "telegram":
            return ((0, jsx_runtime_1.jsx)(TextAvatar_1.TextAvatar, { text: author.n, background: (0, Telegram_1.BackgroundForTelegramAvatar)(index), color: "#fff", useInitials: 2 }));
        case "messenger":
            placeholder = RawImg(default_avatar_png_1.default);
            break;
        case "whatsapp":
            placeholder = RawImg(avatar_placeholder_png_1.default);
            break;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "Avatar", children: (0, jsx_runtime_1.jsx)(LazyImage_1.LazyImage, { src: url, placeholder: placeholder }) }));
};
exports.AuthorAvatar = AuthorAvatar;
