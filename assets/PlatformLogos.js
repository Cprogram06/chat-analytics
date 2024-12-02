"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformLogos = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const discord_svg_1 = __importDefault(require("@assets/images/logos/discord.svg"));
const messenger_svg_1 = __importDefault(require("@assets/images/logos/messenger.svg"));
const telegram_svg_1 = __importDefault(require("@assets/images/logos/telegram.svg"));
const whatsapp_svg_1 = __importDefault(require("@assets/images/logos/whatsapp.svg"));
exports.PlatformLogos = {
    discord: (0, jsx_runtime_1.jsx)("img", { src: discord_svg_1.default, alt: "" }),
    messenger: (0, jsx_runtime_1.jsx)("img", { src: messenger_svg_1.default, alt: "" }),
    telegram: (0, jsx_runtime_1.jsx)("img", { src: telegram_svg_1.default, alt: "" }),
    whatsapp: (0, jsx_runtime_1.jsx)("img", { src: whatsapp_svg_1.default, alt: "" }),
};
