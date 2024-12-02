import React from "react";

import {
    MostConversations,
    MostLinkedDomains,
    MostLinks,
    MostMentioned,
    MostMessagesAuthors,
    MostMessagesChannels,
    MostNegativeMessages,
    MostPositiveMessages,
    MostProducerEmojis,
    MostReactionReceiver,
    MostRepliesAuthors,
    MostUsedEmojis,
} from "@report/components/cards/MostCards";

interface CompositeScoreProps {
    mostReactions: number;
    mostConversationsStarted: number;
    mostResponses: number;
    mostPositiveSentiment: number;
    messagesSent: number;
}

const CompositeScore: React.FC<CompositeScoreProps> = ({
    mostReactions,
    mostConversationsStarted,
    mostResponses,
    mostPositiveSentiment,
    messagesSent,
}) => {
    const calculateCompositeScore = () => {
        const weightMostConversationsStarted = 0.3; // 30%
        const weightMostResponses = 0.3; // 30%
        const weightMostPositiveSentiment = 0.2; // 20%
        const weightMessagesSent = 0.1; // 10%
        const weightMostReactions = 0.1; // 10%
    
        const compositeScore =
            weightMostConversationsStarted * mostConversationsStarted +
            weightMostResponses * mostResponses +
            weightMostPositiveSentiment * mostPositiveSentiment +
            weightMessagesSent * messagesSent +
            weightMostReactions * mostReactions;
    
        return compositeScore;
    };
    

    return (
        <div>
            <p>Composite Score: {calculateCompositeScore()}</p>
            <MostConversations options={[0]} />
            <MostMessagesAuthors />
            <MostPositiveMessages />
            <MostNegativeMessages />
            <MostRepliesAuthors />
            <MostMessagesChannels />
            <MostUsedEmojis options={[0, 0]} />
            <MostProducerEmojis options={[0]} />
            <MostReactionReceiver options={[0]} />
            <MostLinkedDomains />
            <MostLinks options={[0]} />
            <MostMentioned />
        </div>
    );
};

export default CompositeScore;
