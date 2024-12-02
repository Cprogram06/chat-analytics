"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerParser = void 0;
const Attachments_1 = require("@pipeline/Attachments");
const Parser_1 = require("@pipeline/parse/Parser");
class MessengerParser extends Parser_1.Parser {
    constructor() {
        super(...arguments);
        this.messageIndex = 0;
    }
    // Note: we might want to support the ZIP files provided by Facebook
    // there are two problems with this:
    // 1. there are many channels and users, combining them together would be a mess
    // 2. the ZIP files are very big, including lots of media files so loading the whole ZIP into memory is not feasible
    //
    // so, we just assume the user will provide the appropriate "message_<number>.json" files
    async *parse(file) {
        const fileBuffer = await file.slice();
        const textContent = new TextDecoder("utf-8").decode(fileBuffer);
        // fortunately, there are only 10k messages per file,
        // so we can just parse the whole file at once :)
        const fileContent = JSON.parse(textContent);
        this.emit("guild", {
            id: 0,
            name: "Messenger Chats",
        });
        this.emit("channel", {
            guildId: 0,
            id: fileContent.thread_path,
            name: fileContent.title,
            type: fileContent.participants.length > 2 ? "group" : "dm",
        });
        // we iterate the messages in reverse order since we want to iterate from older to newer
        for (const message of fileContent.messages.reverse()) {
            this.emit("author", {
                id: message.sender_name,
                name: message.sender_name,
                // are there bots in Messenger?
                bot: false,
            });
            this.emit("message", {
                id: this.messageIndex++,
                timestamp: message.timestamp_ms,
                authorId: message.sender_name,
                channelId: fileContent.thread_path,
                textContent: message.content,
                attachments: this.parseAttachments(message),
            });
            yield;
        }
    }
    parseAttachments(message) {
        const attachments = [];
        if (message.photos) {
            for (const photo of message.photos) {
                attachments.push(Attachments_1.AttachmentType.Image);
            }
        }
        if (message.audio_files) {
            for (const audio of message.audio_files) {
                attachments.push(Attachments_1.AttachmentType.Audio);
            }
        }
        if (message.files) {
            for (const file of message.files) {
                attachments.push(Attachments_1.AttachmentType.Other);
            }
        }
        if (message.sticker) {
            attachments.push(Attachments_1.AttachmentType.Sticker);
        }
        return attachments;
    }
}
exports.MessengerParser = MessengerParser;
