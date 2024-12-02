"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelAvatar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const AuthorAvatar_1 = require("@report/components/core/avatars/AuthorAvatar");
const AvatarStack_1 = require("@report/components/core/avatars/AvatarStack");
const GuildAvatar_1 = require("@report/components/core/avatars/GuildAvatar");
const Telegram_1 = require("@report/components/core/avatars/Telegram");
const TextAvatar_1 = require("@report/components/core/avatars/TextAvatar");
const group_avatar_0_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/group_avatar_0.png"));
const group_avatar_1_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/group_avatar_1.png"));
const group_avatar_2_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/group_avatar_2.png"));
const group_avatar_3_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/group_avatar_3.png"));
const group_avatar_4_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/group_avatar_4.png"));
const group_avatar_5_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/group_avatar_5.png"));
const group_avatar_6_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/group_avatar_6.png"));
const group_avatar_7_png_1 = __importDefault(require("@assets/images/platforms/discord/avatars/group_avatar_7.png"));
const group_placeholder_png_1 = __importDefault(require("@assets/images/platforms/whatsapp/group_placeholder.png"));
const DiscordDefaultGroupAvatars = [
    group_avatar_0_png_1.default,
    group_avatar_1_png_1.default,
    group_avatar_2_png_1.default,
    group_avatar_3_png_1.default,
    group_avatar_4_png_1.default,
    group_avatar_5_png_1.default,
    group_avatar_6_png_1.default,
    group_avatar_7_png_1.default,
];
const ChannelAvatar = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const platform = db.config.platform;
    const channel = db.channels[index];
    if (channel.type === "dm") {
        // if the channel is a DM, show the avatar of the authors
        return ((0, jsx_runtime_1.jsx)(AvatarStack_1.AvatarStack, { avatars: channel.participants.map((i) => ((0, jsx_runtime_1.jsx)(AuthorAvatar_1.AuthorAvatar, { index: i }, i))) }));
    }
    if (channel.type === "group") {
        if (platform === "telegram") {
            return ((0, jsx_runtime_1.jsx)(TextAvatar_1.TextAvatar, { text: channel.name, background: (0, Telegram_1.BackgroundForTelegramAvatar)(index), color: "#fff", useInitials: 2 }));
        }
        let src = undefined;
        if (platform === "discord") {
            // Discord uses the timestamp part of the channel snowflake to determine which group avatar to use
            const timestamp = parseInt(channel.avatar || "0");
            src = DiscordDefaultGroupAvatars[timestamp % DiscordDefaultGroupAvatars.length];
        }
        else if (platform === "whatsapp") {
            src = group_placeholder_png_1.default;
        }
        if (src) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "Avatar", children: (0, jsx_runtime_1.jsx)("img", { src: src, style: {
                        width: "100%",
                        height: "100%",
                    } }) }));
        }
    }
    return (0, jsx_runtime_1.jsx)(GuildAvatar_1.GuildAvatar, { index: channel.guildIndex });
};
exports.ChannelAvatar = ChannelAvatar;
