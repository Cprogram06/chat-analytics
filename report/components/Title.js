"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Title = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const AuthorAvatar_1 = require("@report/components/core/avatars/AuthorAvatar");
const AvatarStack_1 = require("@report/components/core/avatars/AvatarStack");
const ChannelAvatar_1 = require("@report/components/core/avatars/ChannelAvatar");
const GuildAvatar_1 = require("@report/components/core/avatars/GuildAvatar");
const BaseLabel_1 = require("@report/components/core/labels/BaseLabel");
const ChannelLabel_1 = require("@report/components/core/labels/ChannelLabel");
const GuildLabel_1 = require("@report/components/core/labels/GuildLabel");
const topK = 3;
const Title = () => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    if (db.config.platform !== "discord") {
        /*
        We assume there is always only one guild.

        1 DM channel: [two default platform avatars] ... [A] & [B]
        1 Group channel: [icon of the group] [Group name]
        2+ channels: [platform logo] [Platform name] Chats
        */
        if (db.channels.length === 1) {
            return (0, jsx_runtime_1.jsx)(ChannelLabel_1.ChannelLabel, { index: 0 });
        }
        return (0, jsx_runtime_1.jsx)(GuildLabel_1.GuildLabel, { index: 0 });
    }
    /*
    1 Guild:
      - is "Direct Messages"
         - 1 channel:
           - isDM: [avatars of the two participants] ... [A] & [B]
           - isGroup: [icon of the group] [Group name]
         - 2+ channels:
           - all are DMs: [avatars of the top K authors] Discord DMs
           - all are groups: [icon of top the K groups] Discord Groups
           - a mix: [avatars of the top K authors] Discord Chats
      - isServer: [server icon] [Server name]

    2+ Guilds:
      - has "Direct Messages": [icon of top K servers] Discord Servers and DMs
      - only servers: [icon of top K servers] Discord Servers
    */
    let avatars;
    if (db.guilds.length > 1) {
        const topGuilds = db.guilds
            .map((_, i) => ({
            count: db.channels.filter((c) => c.guildIndex === i).reduce((sum, c) => sum + (c.msgCount || 0), 0),
            index: i,
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, topK)
            .map((g) => g.index);
        avatars = topGuilds.map((guildIndex) => (0, jsx_runtime_1.jsx)(GuildAvatar_1.GuildAvatar, { index: guildIndex }));
    }
    else {
        const guild = db.guilds[0];
        if (guild.name !== "Direct Messages")
            return (0, jsx_runtime_1.jsx)(GuildLabel_1.GuildLabel, { index: 0 });
        if (db.channels.length === 1)
            return (0, jsx_runtime_1.jsx)(ChannelLabel_1.ChannelLabel, { index: 0 });
        if (db.channels.every((c) => c.type === "group")) {
            const topChannels = db.channels
                .map((c, i) => ({ count: c.msgCount || 0, index: i }))
                .sort((a, b) => b.count - a.count)
                .slice(0, topK)
                .map((c) => c.index);
            avatars = topChannels.map((channelIndex) => (0, jsx_runtime_1.jsx)(ChannelAvatar_1.ChannelAvatar, { index: channelIndex }));
        }
        else {
            avatars = new Array(topK).fill(0).map((_, authorIndex) => (0, jsx_runtime_1.jsx)(AuthorAvatar_1.AuthorAvatar, { index: authorIndex }));
        }
    }
    return (0, jsx_runtime_1.jsx)(BaseLabel_1.BaseLabel, { title: db.title, name: db.title, avatar: (0, jsx_runtime_1.jsx)(AvatarStack_1.AvatarStack, { avatars: avatars }) });
};
exports.Title = Title;
