"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramParser = void 0;
const Attachments_1 = require("@pipeline/Attachments");
const File_1 = require("@pipeline/parse/File");
const JSONStream_1 = require("@pipeline/parse/JSONStream");
const Parser_1 = require("@pipeline/parse/Parser");
class TelegramParser extends Parser_1.Parser {
    async *parse(file, progress) {
        this.lastMessageTimestampInFile = await (0, File_1.tryToFindTimestampAtEnd)(TelegramParser.TS_MSG_REGEX, file);
        const stream = new JSONStream_1.JSONStream()
            .onObject("name", this.onChannelName.bind(this))
            .onObject("type", this.onChannelType.bind(this))
            .onObject("id", this.onChannelId.bind(this))
            .onArrayItem("messages", this.parseMessage.bind(this));
        yield* (0, File_1.streamJSONFromFile)(stream, file, progress);
        this.lastChannelName = undefined;
        this.lastChannelID = undefined;
    }
    onChannelName(channelName) {
        this.lastChannelName = channelName;
    }
    onChannelType(channelType) {
        this.lastChannelType = channelType;
    }
    onChannelId(rawChannelId) {
        this.lastChannelID = rawChannelId;
        const pguild = {
            id: 0,
            name: "Telegram Chats",
        };
        const pchannel = {
            id: rawChannelId,
            guildId: 0,
            name: this.lastChannelName || "Telegram chat",
            type: ["personal_chat", "bot_chat"].includes(this.lastChannelType || "") ? "dm" : "group",
        };
        this.emit("guild", pguild, this.lastMessageTimestampInFile);
        this.emit("channel", pchannel, this.lastMessageTimestampInFile);
    }
    parseMessage(message) {
        if (this.lastChannelID === undefined)
            throw new Error("Missing channel ID");
        const rawId = message.id + "";
        const rawAuthorId = message.from_id + "";
        const rawReplyToId = message.reply_to_message_id === null ? undefined : message.reply_to_message_id + "";
        const timestamp = Date.parse(message.date);
        const timestampEdit = message.edited ? Date.parse(message.edited) : undefined;
        if (message.type === "message") {
            const pauthor = {
                id: rawAuthorId,
                // use the ID as name if no nickname is available
                name: message.from || rawId,
                // NOTE: I can't find a reliable way to detect if an author is a bot :(
                bot: false,
            };
            this.emit("author", pauthor, this.lastMessageTimestampInFile);
            let textContent = this.parseTextArray(message.text);
            let attachment;
            // determinate attachment type
            if (message.media_type === "sticker")
                attachment = Attachments_1.AttachmentType.Sticker;
            if (message.mime_type)
                attachment = (0, Attachments_1.getAttachmentTypeFromMimeType)(message.mime_type);
            if (message.location_information !== undefined)
                attachment = Attachments_1.AttachmentType.Other;
            if (textContent.length === 0 && attachment === undefined) {
                // sometimes messages do not include the "mime_type" but "photo"
                if (message.photo)
                    attachment = Attachments_1.AttachmentType.Image;
                // polls
                if (message.poll) {
                    // put the question as the message content
                    textContent = message.poll.question;
                }
                // NOTE: also :dart: emoji appears as empty content
            }
            const pmessage = {
                id: rawId,
                replyTo: rawReplyToId,
                authorId: rawAuthorId,
                channelId: this.lastChannelID,
                timestamp,
                timestampEdit,
                textContent,
                attachments: attachment === undefined ? [] : [attachment],
                // NOTE: as of now, Telegram doesn't export reactions :(
                // reactions: [],
            };
            this.emit("message", pmessage, this.lastMessageTimestampInFile);
        }
    }
    parseTextArray(input) {
        if (typeof input === "string")
            return input;
        if (Array.isArray(input))
            return input.map(this.parseTextArray.bind(this)).join("");
        switch (input.type) {
            // remove slash and split potential @
            // examples:
            // /command → command
            // /command@bot → command @bot
            case "bot_command":
                return input.text.replace("/", "").replace("@", " @");
            // remove #
            case "hashtag":
                return input.text.replace("#", "");
            // add redundant spaces to the sides to make sure it will be tokenized correctly
            case "link":
            case "mention":
            case "text_link":
                return ` ${input.text} `;
            // emails are removed
            case "email":
                return "";
            // by default just return the text
            default:
                return input.text;
        }
    }
}
exports.TelegramParser = TelegramParser;
/**
 * Regex to find the timestamp of the last message in a Telegram export file.
 * We use the timestamp of the last message as the `at` value (see @Parser)
 */
TelegramParser.TS_MSG_REGEX = /"date_unixtime": ?"([0-9]+)"/gi;
