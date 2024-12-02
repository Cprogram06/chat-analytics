"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Platforms_1 = require("@pipeline/Platforms");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const Card_1 = __importDefault(require("@report/components/Card"));
const Footer_1 = __importDefault(require("@report/components/Footer"));
const Header_1 = __importDefault(require("@report/components/Header"));
const LoadingOverlay_1 = __importDefault(require("@report/components/LoadingOverlay"));
const ScrollableCard_1 = __importDefault(require("@report/components/ScrollableCard"));
const Tabs_1 = require("@report/components/Tabs");
const MostCards_1 = require("@report/components/cards/MostCards");
const TopCards_1 = require("@report/components/cards/TopCards");
const EmojiStatsTable_1 = __importDefault(require("@report/components/cards/emojis/EmojiStatsTable"));
const ConversationParticipation_1 = __importDefault(require("@report/components/cards/interaction/ConversationParticipation"));
const LanguageStatsTable_1 = __importDefault(require("@report/components/cards/language/LanguageStatsTable"));
const WordsUsage_1 = __importDefault(require("@report/components/cards/language/WordsUsage"));
const DomainsTree_1 = __importDefault(require("@report/components/cards/links/DomainsTree"));
const EditTime_1 = __importDefault(require("@report/components/cards/messages/EditTime"));
const EditedMessages_1 = __importDefault(require("@report/components/cards/messages/EditedMessages"));
const MessagesOverTime_1 = require("@report/components/cards/messages/MessagesOverTime");
const MessagesStatsTable_1 = __importDefault(require("@report/components/cards/messages/MessagesStatsTable"));
const WeekdayHourActivity_1 = require("@report/components/cards/messages/WeekdayHourActivity");
const SentimentOverTime_1 = __importDefault(require("@report/components/cards/sentiment/SentimentOverTime"));
const SentimentStatsTable_1 = __importDefault(require("@report/components/cards/sentiment/SentimentStatsTable"));
const ActiveAuthorsOverTime_1 = __importDefault(require("@report/components/cards/timeline/ActiveAuthorsOverTime"));
const GrowthOverTime_1 = __importDefault(require("@report/components/cards/timeline/GrowthOverTime"));
require("@assets/styles/ReportPage.less");
const CardContainer = (props) => (0, jsx_runtime_1.jsx)("div", { className: "CardContainer", children: props.children });
const ReportDashboard = () => {
    const [section, setSection] = (0, react_1.useState)("messages");
    const sections = (0, react_1.useMemo)(() => {
        const database = (0, WorkerWrapper_1.getDatabase)();
        const platformInfo = Platforms_1.PlatformsInfo[database.config.platform];
        const conversationTooltip = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("b", { children: "\u2753 Conversation:" }), " Every group of messages separated by 30 minutes without messages is considered a conversation", (0, jsx_runtime_1.jsx)("br", {}), "This metric is computed per channel"] }));
        const stopwordsTooltip = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["\u26A0\uFE0F Note that stopwords (words that don't add meaningful information such as \"the\", \"a\", etc) are", " ", (0, jsx_runtime_1.jsx)("b", { children: "not" }), " taken into account"] }));
        return [
            {
                name: "💬 Messages",
                value: "messages",
                cards: [
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 2, title: ["Messages sent over time", ["by day", "by week", "by month"]], defaultOptions: database.time.numDays < 365 * 2 ? [0] : [2], children: MessagesOverTime_1.MessagesOverTime }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Message statistics", children: MessagesStatsTable_1.default, tooltip: database.config.platform === "whatsapp" ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "\u26A0\uFE0F Note that if the chat has been exported from Android it may not contain information about the media type (image, sticker, etc). iOS exports do." })) : undefined }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: ["Activity by week day & hour", ["(split)", "(heatmap)"]], children: WeekdayHourActivity_1.WeekdayHourActivity }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Messages sent by author", children: MostCards_1.MostMessagesAuthors }),
                    (0, jsx_runtime_1.jsx)(ScrollableCard_1.default, { num: 1, title: "Most Positive author", children: MostCards_1.MostPositiveMessages }),
                    (0, jsx_runtime_1.jsx)(ScrollableCard_1.default, { num: 1, title: "Most Negative author", children: MostCards_1.MostNegativeMessages }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Messages sent by channel", children: MostCards_1.MostMessagesChannels }),
                    (0, jsx_runtime_1.jsx)(ScrollableCard_1.default, { num: 1, title: "Top Composite Scores", children: MostCards_1.TopCompositeScores }),
                ].concat(platformInfo.support.edits
                    ? [
                        (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: ["Edited messages", ["by author", "in channel"]], children: EditedMessages_1.default, tooltip: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["If a message has been edited multiple times, it will count as if it was edited only once.", (0, jsx_runtime_1.jsx)("br", {}), "For the percentage, the author/channel ", (0, jsx_runtime_1.jsx)("b", { children: "must have at least 100 messages" }), " ", "with the current filters"] }) }),
                        (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Time between sending and editing", children: EditTime_1.default, tooltip: "If a message has been edited multiple times, we take the time of the last edit" }),
                    ]
                    : []),
            },
            {
                name: "🅰️ Language",
                value: "language",
                cards: [
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 2, title: ["Most used words", ["(as table)", "(as word cloud)"]], children: WordsUsage_1.default, tooltip: stopwordsTooltip }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Language statistics", children: LanguageStatsTable_1.default, tooltip: stopwordsTooltip }),
                ],
            },
            {
                name: "😃 Emoji",
                value: "emoji",
                cards: [
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: ["Most used", ["emoji (all)", "regular emoji", "custom emoji"]].concat(platformInfo.support.reactions ? ["in", ["text", "reactions"]] : []), children: MostCards_1.MostUsedEmojis, tooltip: platformInfo.support.reactions
                            ? "Reactions placed in messages written by the authors filtered"
                            : undefined }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: ["Emoji sent", ["by author", "in channel"]], children: MostCards_1.MostProducerEmojis }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Emoji statistics", children: EmojiStatsTable_1.default }),
                ],
            },
            {
                name: "🔗 Links",
                value: "links",
                cards: [
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Most linked domains", children: MostCards_1.MostLinkedDomains }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 2, title: "Linked by domain hierarchy", children: DomainsTree_1.default }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: ["Most links sent", ["by author", "in channel"]], children: MostCards_1.MostLinks }),
                ],
            },
            {
                name: "🌀 Interaction",
                value: "interaction",
                cards: [(0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Most mentioned", children: MostCards_1.MostMentioned })]
                    .concat(platformInfo.support.reactions
                    ? [
                        (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: ["Top reacted messages", ["(total)", "(single)"]], children: TopCards_1.TopReacted }),
                        (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: [["Authors", "Channels"], "that get the most reactions"], children: MostCards_1.MostReactionReceiver }),
                    ]
                    : [])
                    .concat(platformInfo.support.replies
                    ? [
                        (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Authors that reply the most messages", children: MostCards_1.MostRepliesAuthors, tooltip: 'This is clicking "Reply" in the app' }),
                    ]
                    : [])
                    .concat(database.authors.length > 2
                    ? [
                        (0, jsx_runtime_1.jsx)(Card_1.default, { num: 2, title: "Participation in conversations between the top", children: ConversationParticipation_1.default, tooltip: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [conversationTooltip, (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("b", { children: "\u2753 Between the top:" }), " only the 20 most active authors in the period selected are shown here"] }) }),
                    ]
                    : [])
                    .concat([
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: ["Conversations started", ["by author", "in channel"]], children: MostCards_1.MostConversations, tooltip: conversationTooltip }),
                ]),
            },
            {
                name: "💙 Sentiment",
                value: "sentiment",
                cards: [
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 2, defaultOptions: [1, 1], title: [
                            "Sentiment over time",
                            ["by week", "by month"],
                            ["(% of total)", "(# messages)", "(# messages diff)"],
                        ], children: SentimentOverTime_1.default }),
                    (0, jsx_runtime_1.jsx)(Card_1.default, { num: 1, title: "Sentiment overview", children: SentimentStatsTable_1.default }),
                ],
            },
            {
                name: "📅 Timeline",
                value: "timeline",
                cards: database.authors.length <= 2
                    ? []
                    : [
                        (0, jsx_runtime_1.jsx)(Card_1.default, { num: 3, title: "Active authors over time, by month", children: ActiveAuthorsOverTime_1.default, tooltip: "An author is considered active if it has sent at least one message in the month" }),
                        (0, jsx_runtime_1.jsx)(Card_1.default, { num: 3, title: "Server/group growth", children: GrowthOverTime_1.default, tooltip: "Only authors that sent at least one message are considered" }),
                    ],
            },
        ].filter(({ cards }) => env.isDev || cards.length > 0);
    }, []);
    const isDemo = (0, WorkerWrapper_1.getDatabase)().config.demo;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isDemo ? (0, jsx_runtime_1.jsx)("div", { className: "Demo", children: "This report is a demo" }) : null, (0, jsx_runtime_1.jsx)(Header_1.default, { sections: sections, section: section, setSection: setSection }), sections.map((s) => ((0, jsx_runtime_1.jsx)(Tabs_1.TabContainer, { value: s.value, currentValue: section, children: (0, jsx_runtime_1.jsx)(CardContainer, { children: s.cards.map((c, i) => ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: c }, i))) }) }, s.value))), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
};
const ReportPage = () => {
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => void (0, WorkerWrapper_1.getWorker)().once("ready", () => setTimeout(() => setLoading(false), 1000 - Math.min(performance.now(), 1000))), []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!loading && (0, jsx_runtime_1.jsx)(ReportDashboard, {}), (0, jsx_runtime_1.jsx)(LoadingOverlay_1.default, { loading: loading })] }));
};
exports.default = ReportPage;
