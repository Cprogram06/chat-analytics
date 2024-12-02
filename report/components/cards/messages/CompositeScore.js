"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const MostCards_1 = require("@report/components/cards/MostCards");
const CompositeScore = ({ mostReactions, mostConversationsStarted, mostResponses, mostPositiveSentiment, messagesSent, }) => {
    const calculateCompositeScore = () => {
        const weightMostConversationsStarted = 0.3; // 30%
        const weightMostResponses = 0.3; // 30%
        const weightMostPositiveSentiment = 0.2; // 20%
        const weightMessagesSent = 0.1; // 10%
        const weightMostReactions = 0.1; // 10%
        const compositeScore = weightMostConversationsStarted * mostConversationsStarted +
            weightMostResponses * mostResponses +
            weightMostPositiveSentiment * mostPositiveSentiment +
            weightMessagesSent * messagesSent +
            weightMostReactions * mostReactions;
        return compositeScore;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Composite Score: ", calculateCompositeScore()] }), (0, jsx_runtime_1.jsx)(MostCards_1.MostConversations, { options: [0] }), (0, jsx_runtime_1.jsx)(MostCards_1.MostMessagesAuthors, {}), (0, jsx_runtime_1.jsx)(MostCards_1.MostPositiveMessages, {}), (0, jsx_runtime_1.jsx)(MostCards_1.MostNegativeMessages, {}), (0, jsx_runtime_1.jsx)(MostCards_1.MostRepliesAuthors, {}), (0, jsx_runtime_1.jsx)(MostCards_1.MostMessagesChannels, {}), (0, jsx_runtime_1.jsx)(MostCards_1.MostUsedEmojis, { options: [0, 0] }), (0, jsx_runtime_1.jsx)(MostCards_1.MostProducerEmojis, { options: [0] }), (0, jsx_runtime_1.jsx)(MostCards_1.MostReactionReceiver, { options: [0] }), (0, jsx_runtime_1.jsx)(MostCards_1.MostLinkedDomains, {}), (0, jsx_runtime_1.jsx)(MostCards_1.MostLinks, { options: [0] }), (0, jsx_runtime_1.jsx)(MostCards_1.MostMentioned, {})] }));
};
exports.default = CompositeScore;
