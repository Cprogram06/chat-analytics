"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const ChannelAvatar_1 = require("@report/components/core/avatars/ChannelAvatar");
const BaseLabel_1 = require("@report/components/core/labels/BaseLabel");
const hashtag_svg_1 = __importDefault(require("@assets/images/icons/hashtag.svg"));
const _ChannelLabel = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const platform = db.config.platform;
    const channel = db.channels[index];
    const guild = db.guilds[channel.guildIndex];
    let title = channel.name;
    let name = channel.name;
    let avatar;
    let icon;
    if (platform === "discord") {
        // prepend the guild name to the channel name
        title = guild.name + " > " + name;
        if (channel.type === "text") {
            // show a # before channel names because Discord does it
            // NOTE: in the future we may want to show the other channel types icons (e.g. voice)
            icon = (0, jsx_runtime_1.jsx)("img", { src: hashtag_svg_1.default, height: 12 });
        }
    }
    const showAvatar = channel.type !== "text" ||
        // if there are more than two guilds in the report, show the guild avatar
        // so users can distinguish between text channels with the same name
        db.guilds.length >= 2;
    if (showAvatar) {
        avatar = (0, jsx_runtime_1.jsx)(ChannelAvatar_1.ChannelAvatar, { index: index });
    }
    return (0, jsx_runtime_1.jsx)(BaseLabel_1.BaseLabel, { title: title, name: name, leftIcon: icon, avatar: avatar });
};
exports.ChannelLabel = (0, react_1.memo)(_ChannelLabel);
