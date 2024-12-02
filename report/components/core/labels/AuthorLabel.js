"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const AuthorAvatar_1 = require("@report/components/core/avatars/AuthorAvatar");
const BaseLabel_1 = require("@report/components/core/labels/BaseLabel");
const bot_svg_1 = __importDefault(require("@assets/images/icons/bot.svg"));
const _AuthorLabel = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const isDemo = db.config.demo;
    const author = db.authors[index];
    const title = author.n + (author.b ? " (bot)" : "");
    const avatar = (0, jsx_runtime_1.jsx)(AuthorAvatar_1.AuthorAvatar, { index: index });
    let name = author.n;
    let icon;
    // add discriminator in Discord
    if (db.config.platform === "discord") {
        let n = author.n;
        let discr = n.split("#").pop();
        // only keep if it's 4 chars (and not a deleted ID)
        if (discr && discr.length === 4) {
            discr = parseInt(discr).toString();
            n = n.slice(0, -5);
        }
        else
            discr = undefined;
        name = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [n, discr && (0, jsx_runtime_1.jsx)("span", { className: "Label__discriminator" })] }));
    }
    if (author.b) {
        icon = (0, jsx_runtime_1.jsx)("img", { src: bot_svg_1.default, height: 15 });
    }
    return (0, jsx_runtime_1.jsx)(BaseLabel_1.BaseLabel, { title: title, name: name, avatar: avatar, rightIcon: icon });
};
exports.AuthorLabel = (0, react_1.memo)(_AuthorLabel);
