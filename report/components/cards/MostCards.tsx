import React, { useState } from "react";

import { Index } from "@pipeline/Types";
import { EmojiStats } from "@pipeline/aggregate/blocks/emojis/EmojiStats";
import { ConversationStats } from "@pipeline/aggregate/blocks/interaction/ConversationStats";
import { InteractionStats } from "@pipeline/aggregate/blocks/interaction/InteractionStats";
import { LanguageStats } from "@pipeline/aggregate/blocks/language/LanguageStats";
import { Author } from "@pipeline/process/Types";
import { useBlockData } from "@report/BlockHook";
import { getDatabase, getFormatCache } from "@report/WorkerWrapper";
import WordCloud from "@report/components/cards/language/WordCloud";
import { AuthorLabel } from "@report/components/core/labels/AuthorLabel";
import { ChannelLabel } from "@report/components/core/labels/ChannelLabel";
import { DomainLabel } from "@report/components/core/labels/DomainLabel";
import { EmojiLabel } from "@report/components/core/labels/EmojiLabel";
import { MentionLabel } from "@report/components/core/labels/MentionLabel";
import { WordLabel } from "@report/components/core/labels/WordLabel";
import MostUsed from "@report/components/viz/MostUsed";
import { RawID } from "@pipeline/parse/Types";

///////////////////////////
/// AUTHORS
///////////////////////////
export const MostMessagesAuthors = () => (
    <MostUsed
        what="Author"
        unit="Total messages"
        counts={useBlockData("messages/stats")?.counts.authors}
        itemComponent={AuthorLabel}
        maxItems={Math.min(15, getDatabase().authors.length)}
        colorHue={240}
    />
);

export const MostPositiveMessages = () => (
    <MostUsed
        what="Author"
        unit="Postive Messages Count"
        counts={useBlockData("messages/stats")?.counts.positiveMessages}
        itemComponent={AuthorLabel}
        maxItems={Math.min(50, getDatabase().authors.length)}
        colorHue={240}
    />
);

export const TopCompositeScores = () => {
    const [compositeScores, setCompositeScores] = useState<number[] | undefined>(undefined);

    const handleExportCSV = (
        data: number[],
        messages: number[],
        reactions: number[],
        replies: number[],
        positiveM: number[],
        convo: number[],
        authorNames: string[],
        authorID: RawID[]
    ) => {
        if (data && authorNames.length === data.length) {
            setCompositeScores(data);
            // Perform any data processing or formatting if needed

            // Create an array of CSV rows with additional data for sorting
            const csvRowsWithSorting = authorNames.map((name, index) => ({
                name,
                data: data[index],
                messages: messages[index],
                reactions: reactions[index],
                replies: replies[index],
                positiveM: positiveM[index],
                convo: convo[index],
                id:authorID[index],
            }));

            // Sort the CSV rows based on the composite score in descending order
            csvRowsWithSorting.sort((a, b) => b.data - a.data);

            // Convert the sorted rows back to CSV rows
            const csvRows = csvRowsWithSorting.map(
                (entry) =>
                    `${entry.id},${entry.name},${entry.data},${entry.messages},${entry.reactions},${entry.replies},${entry.positiveM},${entry.convo},`
            );

            // Add headers
            const csvContent =
                "AuthorID,Author,Composite Score,Messages Count (10%),Reactions Count (10%),Replies Count (30%),Positive Messages Count (20%),Conversation Count (30%),AXS Allocation\n" +
                csvRows.join("\n");

            // Get the current date and time
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

            // Create a Blob and initiate the download with the dynamic file name
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `CompositeScore_${formattedDate}.csv`;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const counts = useBlockData("messages/stats")?.compositeScores;
    const messagesCount = useBlockData("messages/stats")?.counts.authors;
    const reactionsCount = useBlockData("messages/stats")?.counts.mostEmoji;
    const repliesCount = useBlockData("messages/stats")?.counts.mostReply;
    const posMesCount = useBlockData("messages/stats")?.counts.positiveMessages;
    const disconCount = useBlockData("messages/stats")?.counts.mostAuthorConvo;

    return (
        <div>
            <button
                style={{
                    display: "block",
                    backgroundColor: "#217346",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    margin: "0 auto",
                    transition: "background-color 0.3s, color 0.3s",
                }}
                onClick={() =>
                    handleExportCSV(
                        counts ?? [],
                        messagesCount ?? [],
                        reactionsCount ?? [],
                        repliesCount ?? [],
                        posMesCount ?? [],
                        disconCount ?? [],
                        getDatabase().authors.map((author) => author.n),
                        getDatabase().authors.map((author) => author.i),
                    )
                }
            >
                Export Scores
            </button>
            <MostUsed
                what="Author"
                unit="Composite Score"
                counts={counts}
                itemComponent={AuthorLabel}
                maxItems={Math.min(50, getDatabase().authors.length)}
                colorHue={240}
            />
        </div>
    );
};

export const MostNegativeMessages = () => (
    <MostUsed
        what="Author"
        unit="Negative Messages Count"
        counts={useBlockData("messages/stats")?.counts.negativeMessages}
        itemComponent={AuthorLabel}
        maxItems={Math.min(50, getDatabase().authors.length)}
        colorHue={240}
    />
);

export const MostRepliesAuthors = () => (
    <MostUsed
        what="Author"
        unit="# of messages replied"
        counts={useBlockData("interaction/stats")?.authorsReplyCount}
        itemComponent={AuthorLabel}
        maxItems={Math.min(15, getDatabase().authors.length)}
        colorHue={240}
    />
);

///////////////////////////
/// CHANNELS
///////////////////////////
export const MostMessagesChannels = () => (
    <MostUsed
        what="Channel"
        unit="Total messages"
        counts={useBlockData("messages/stats")?.counts.channels}
        itemComponent={ChannelLabel}
        maxItems={Math.min(15, getDatabase().channels.length)}
        colorHue={266}
    />
);

///////////////////////////
/// CONVERSATIONS
///////////////////////////
export const MostConversations = ({ options }: { options: number[] }) => {
    const conversationStats = useBlockData("interaction/conversation-stats");
    return (
        <MostUsed
            what={options[0] === 0 ? "Author" : "Channel"}
            unit="# of conversations started"
            counts={
                conversationStats
                    ? conversationStats[options[0] === 0 ? "authorConversations" : "channelConversations"]
                    : undefined
            }
            itemComponent={options[0] === 0 ? AuthorLabel : ChannelLabel}
            maxItems={Math.min(15, Math.max(getDatabase().authors.length, getDatabase().channels.length))}
            colorHue={options[0] === 0 ? 240 : 266}
        />
    );
};

///////////////////////////
/// EMOJIS
///////////////////////////
const EmojiFilterFns = {
    "0": undefined, // all emoji
    "1": (index: number) => getDatabase().emojis[index].type === "unicode", // regular emoji
    "2": (index: number) => getDatabase().emojis[index].type === "custom", // custom emoji
};
const EmojiFilterPlaceholders = {
    "0": 'Filter emoji... (e.g. "fire", "🔥" or ":pepe:")',
    "1": 'Filter emoji... (e.g. "fire" or "🔥")',
    "2": 'Filter emoji... (e.g. ":pepe:")',
};
const EmojisTransformFilter = (filter: string) => filter.replace(/:/g, "");
const EmojisIndexOf = (value: string) => {
    const rawEmoji = getDatabase().emojis.findIndex((e) => e.name === value);
    if (rawEmoji === -1) return getFormatCache().emojis.indexOf(value);
    return rawEmoji;
};
const EmojisInFilter = (index: Index, filter: string) => getFormatCache().emojis[index].includes(filter);
export const MostUsedEmojis = ({ options }: { options: number[] }) => {
    const emojiStats = useBlockData("emoji/stats");
    return (
        <MostUsed
            what="Emoji"
            unit={options[1] === 1 ? "Times reacted" : "Times used"}
            counts={emojiStats ? emojiStats[options[1] === 1 ? "inReactions" : "inText"].counts.emojis : undefined}
            filter={EmojiFilterFns[options[0] as unknown as keyof typeof EmojiFilterFns]}
            maxItems={Math.min(15, getDatabase().emojis.length)}
            itemComponent={EmojiLabel}
            searchable
            searchPlaceholder={EmojiFilterPlaceholders[options[0] as unknown as keyof typeof EmojiFilterPlaceholders]}
            transformFilter={EmojisTransformFilter}
            indexOf={EmojisIndexOf}
            inFilter={EmojisInFilter}
        />
    );
};
export const MostProducerEmojis = ({ options }: { options: number[] }) => {
    const emojiStats = useBlockData("emoji/stats");
    return (
        <MostUsed
            what={options[0] === 0 ? "Author" : "Channel"}
            unit="# of emoji used"
            counts={emojiStats ? emojiStats.inText.counts[options[0] === 0 ? "authors" : "channels"] : undefined}
            maxItems={Math.min(15, Math.max(getDatabase().authors.length, getDatabase().channels.length))}
            itemComponent={options[0] === 0 ? AuthorLabel : ChannelLabel}
            colorHue={options[0] === 0 ? 240 : 266}
        />
    );
};
export const MostReactionReceiver = ({ options }: { options: number[] }) => {
    const emojiStats = useBlockData("emoji/stats");
    return (
        <MostUsed
            what={options[0] === 0 ? "Author" : "Channel"}
            unit="# of reactions received"
            counts={emojiStats ? emojiStats.inReactions.counts[options[0] === 0 ? "authors" : "channels"] : undefined}
            maxItems={Math.min(15, Math.max(getDatabase().authors.length, getDatabase().channels.length))}
            itemComponent={options[0] === 0 ? AuthorLabel : ChannelLabel}
            colorHue={options[0] === 0 ? 240 : 266}
        />
    );
};

///////////////////////////
/// DOMAINS
///////////////////////////
const DomainsIndexOf = (value: string) => getDatabase().domains.indexOf(value);
const DomainsInFilter = (index: number, filter: string) => getDatabase().domains[index].includes(filter);
export const MostLinkedDomains = () => (
    <MostUsed
        what="Domain"
        unit="Times linked"
        counts={useBlockData("domains/stats")?.counts.domains}
        maxItems={Math.min(15, getDatabase().domains.length)}
        itemComponent={DomainLabel}
        searchable
        searchPlaceholder="Filter domains..."
        indexOf={DomainsIndexOf}
        inFilter={DomainsInFilter}
    />
);
export const MostLinks = ({ options }: { options: number[] }) => (
    <MostUsed
        what={options[0] === 0 ? "Author" : "Channel"}
        unit="Total links sent"
        counts={useBlockData("domains/stats")?.counts[options[0] === 0 ? "authors" : "channels"]}
        itemComponent={options[0] === 0 ? AuthorLabel : ChannelLabel}
        maxItems={Math.min(15, options[0] === 0 ? getDatabase().authors.length : getDatabase().channels.length)}
        colorHue={options[0] === 0 ? 240 : 266}
    />
);

///////////////////////////
/// MENTIONS
///////////////////////////
const MentionsIndexOf = (value: string) => getFormatCache().mentions.indexOf(value);
const MentionsInFilter = (index: number, filter: string) => getFormatCache().mentions[index].includes(filter);
export const MostMentioned = () => (
    <MostUsed
        what="Who"
        unit="Times mentioned"
        counts={useBlockData("interaction/stats")?.mentionsCount}
        itemComponent={MentionLabel}
        maxItems={Math.min(15, getDatabase().mentions.length)}
        searchable
        searchPlaceholder="Filter @mentions..."
        indexOf={MentionsIndexOf}
        inFilter={MentionsInFilter}
    />
);
