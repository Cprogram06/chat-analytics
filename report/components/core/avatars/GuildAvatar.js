"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildAvatar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const LazyImage_1 = require("@report/components/core/LazyImage");
const PlatformAvatar_1 = require("@report/components/core/avatars/PlatformAvatar");
const TextAvatar_1 = require("@report/components/core/avatars/TextAvatar");
const GuildAvatar = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const platform = db.config.platform;
    const guild = db.guilds[index];
    switch (platform) {
        case "discord":
            if (guild.name === "Direct Messages") {
                return (0, jsx_runtime_1.jsx)(PlatformAvatar_1.PlatformAvatar, {});
            }
            let placeholder = (0, jsx_runtime_1.jsx)(TextAvatar_1.TextAvatar, { text: guild.name, background: "#36393f", color: "#DCDDDE", useInitials: 11 });
            return ((0, jsx_runtime_1.jsx)("div", { className: "Avatar", children: (0, jsx_runtime_1.jsx)(LazyImage_1.LazyImage, { src: guild.avatar, placeholder: placeholder }) }));
        case "telegram":
        case "messenger":
        case "whatsapp":
            return (0, jsx_runtime_1.jsx)(PlatformAvatar_1.PlatformAvatar, {});
    }
};
exports.GuildAvatar = GuildAvatar;
