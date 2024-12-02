"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformsInfo = void 0;
exports.PlatformsInfo = {
    discord: {
        name: "Discord",
        color: [235, 86, 65],
        defaultFilename: "<guild> - <channel> [ID].json",
        support: {
            stickers: true,
            reactions: true,
            replies: true,
            edits: true,
        },
    },
    messenger: {
        name: "Messenger",
        color: [214, 89, 52],
        defaultFilename: "message_<number>.json",
        support: {
            stickers: true,
            reactions: false,
            replies: false,
            edits: false,
        },
    },
    telegram: {
        name: "Telegram",
        color: [200, 79, 52],
        defaultFilename: "result.json",
        support: {
            stickers: false,
            reactions: false,
            replies: true,
            edits: true,
        },
    },
    whatsapp: {
        name: "WhatsApp",
        color: [142, 70, 49],
        defaultFilename: "WhatsApp Chat with <chat name>.txt/zip",
        support: {
            stickers: true,
            reactions: false,
            replies: false,
            edits: false,
        },
    },
};