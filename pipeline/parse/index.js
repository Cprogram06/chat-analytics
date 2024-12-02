"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParser = void 0;
const DiscordParser_1 = require("@pipeline/parse/parsers/DiscordParser");
const MessengerParser_1 = require("@pipeline/parse/parsers/MessengerParser");
const TelegramParser_1 = require("@pipeline/parse/parsers/TelegramParser");
const WhatsAppParser_1 = require("@pipeline/parse/parsers/WhatsAppParser");
const createParser = (platform) => {
    let parser = null;
    switch (platform) {
        case "discord":
            parser = new DiscordParser_1.DiscordParser();
            break;
        case "messenger":
            parser = new MessengerParser_1.MessengerParser();
            break;
        case "whatsapp":
            parser = new WhatsAppParser_1.WhatsAppParser();
            break;
        case "telegram":
            parser = new TelegramParser_1.TelegramParser();
            break;
    }
    return parser;
};
exports.createParser = createParser;
