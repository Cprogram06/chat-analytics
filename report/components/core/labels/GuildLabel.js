"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const GuildAvatar_1 = require("@report/components/core/avatars/GuildAvatar");
const BaseLabel_1 = require("@report/components/core/labels/BaseLabel");
const _GuildLabel = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const guild = db.guilds[index];
    return (0, jsx_runtime_1.jsx)(BaseLabel_1.BaseLabel, { title: guild.name, name: guild.name, avatar: (0, jsx_runtime_1.jsx)(GuildAvatar_1.GuildAvatar, { index: index }) });
};
exports.GuildLabel = (0, react_1.memo)(_GuildLabel);
