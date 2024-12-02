"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blocks = void 0;
const DomainsStats_1 = __importDefault(require("@pipeline/aggregate/blocks/domains/DomainsStats"));
const EmojiStats_1 = __importDefault(require("@pipeline/aggregate/blocks/emojis/EmojiStats"));
const ConversationStats_1 = __importDefault(require("@pipeline/aggregate/blocks/interaction/ConversationStats"));
const ConversationsDuration_1 = __importDefault(require("@pipeline/aggregate/blocks/interaction/ConversationsDuration"));
const InteractionStats_1 = __importDefault(require("@pipeline/aggregate/blocks/interaction/InteractionStats"));
const LanguageStats_1 = __importDefault(require("@pipeline/aggregate/blocks/language/LanguageStats"));
const WordStats_1 = __importDefault(require("@pipeline/aggregate/blocks/language/WordStats"));
const MessagesEdited_1 = __importDefault(require("@pipeline/aggregate/blocks/messages/MessagesEdited"));
const MessagesPerPeriod_1 = __importDefault(require("@pipeline/aggregate/blocks/messages/MessagesPerPeriod"));
const MessagesStats_1 = __importDefault(require("@pipeline/aggregate/blocks/messages/MessagesStats"));
const SentimentPerPeriod_1 = __importDefault(require("@pipeline/aggregate/blocks/sentiment/SentimentPerPeriod"));
const SentimentStats_1 = __importDefault(require("@pipeline/aggregate/blocks/sentiment/SentimentStats"));
const ActiveAuthors_1 = __importDefault(require("@pipeline/aggregate/blocks/timeline/ActiveAuthors"));
const Growth_1 = __importDefault(require("@pipeline/aggregate/blocks/timeline/Growth"));
/** All existing blocks must be defined here, so the UI can dynamically load them */
exports.Blocks = {
    [ActiveAuthors_1.default.key]: ActiveAuthors_1.default,
    [ConversationsDuration_1.default.key]: ConversationsDuration_1.default,
    [ConversationStats_1.default.key]: ConversationStats_1.default,
    [DomainsStats_1.default.key]: DomainsStats_1.default,
    [EmojiStats_1.default.key]: EmojiStats_1.default,
    [Growth_1.default.key]: Growth_1.default,
    [InteractionStats_1.default.key]: InteractionStats_1.default,
    [LanguageStats_1.default.key]: LanguageStats_1.default,
    [MessagesEdited_1.default.key]: MessagesEdited_1.default,
    [MessagesPerPeriod_1.default.key]: MessagesPerPeriod_1.default,
    [MessagesStats_1.default.key]: MessagesStats_1.default,
    [SentimentPerPeriod_1.default.key]: SentimentPerPeriod_1.default,
    [SentimentStats_1.default.key]: SentimentStats_1.default,
    [WordStats_1.default.key]: WordStats_1.default,
};
console.warn("This message is here to prevent the inclusion of all blocks in the report UI. " +
    "You should only see this message in the console once. If you see it twice, " +
    "the report UI includes all blocks, which is not what we want.");
