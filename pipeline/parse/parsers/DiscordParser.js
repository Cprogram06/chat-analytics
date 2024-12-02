"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordParser = void 0;
const Attachments_1 = require("@pipeline/Attachments");
const File_1 = require("@pipeline/parse/File");
const JSONStream_1 = require("@pipeline/parse/JSONStream");
const Parser_1 = require("@pipeline/parse/Parser");
class DiscordParser extends Parser_1.Parser {
    /**
     * Parse a Discord export file from DCE (https://github.com/Tyrrrz/DiscordChatExporter)
     *
     * We are assuming that in the JSON file, the "guild" key appear first and the "channel" key second in the file.
     * This is up to DCE, hopefully they won't change it.
     * Since we are streaming the file, we can handle big exports 😊
     */
    async *parse(file, progress) {
        this.lastMessageTimestampInFile = await (0, File_1.tryToFindTimestampAtEnd)(DiscordParser.TS_MSG_REGEX, file);
        const stream = new JSONStream_1.JSONStream()
            .onObject("guild", this.parseGuild.bind(this))
            .onObject("channel", this.parseChannel.bind(this))
            .onArrayItem("messages", this.parseMessage.bind(this));
        yield* (0, File_1.streamJSONFromFile)(stream, file, progress);
    }
    parseGuild(guild) {
        let iconUrl = guild.iconUrl;
        if (iconUrl === "https://cdn.discordapp.com/embed/avatars/0.png") {
            // this is the default icon, we treat is as having no icon at all
            iconUrl = undefined;
        }
        this.emit("guild", { id: guild.id, name: guild.name, avatar: iconUrl }, this.lastMessageTimestampInFile);
        this.lastGuildId = guild.id;
    }
    parseChannel(channel) {
        if (this.lastGuildId === undefined)
            throw new Error("Missing guild ID");
        let type = "text";
        if (channel.type == "DirectTextChat")
            type = "dm";
        else if (channel.type == "DirectGroupTextChat")
            type = "group";
        const pchannel = {
            id: channel.id,
            guildId: this.lastGuildId,
            name: channel.name,
            type,
            // If the channel is a group:
            //   + the default avatar is the timestamp of the Snowflake mod 8
            //   + image avatars are not available in the export, see https://github.com/Tyrrrz/DiscordChatExporter/issues/987
            // else: we other kind of channels don't have avatars
            avatar: type === "group" ? this.parseSnowflake(channel.id).timestamp.toString() : undefined,
        };
        this.emit("channel", pchannel, this.lastMessageTimestampInFile);
        this.lastChannelId = channel.id;
    }
    parseMessage(message) {
        if (this.lastChannelId === undefined)
            throw new Error("Missing channel ID");
        // Timestamps in the export are in UTC
        // "YYYY-MM-DDTHH:MM:SS.mmm+00:00"
        const timestamp = Date.parse(message.timestamp);
        const timestampEdit = message.timestampEdited ? Date.parse(message.timestampEdited) : undefined;
        // Discord allows users to have different nicknames depending the chat. We honor the nickname first
        const name = message.author.nickname || message.author.name;
        const isDeletedUser = name === "Deleted User";
        // About the avatar:
        // See: https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints
        // Can be:
        // - https://cdn.discordapp.com/avatars/user_id/user_avatar.png (custom avatar, we only care about `user_id/user_avatar`)
        // - https://cdn.discordapp.com/embed/avatars/discriminator.png (default color avatar)
        let avatar;
        if (message.author.avatarUrl && message.author.avatarUrl.includes("discordapp.com/avatars"))
            avatar = message.author.avatarUrl.slice(35).split(".")[0];
        const pauthor = {
            id: message.author.id,
            bot: message.author.isBot,
            name: name + (isDeletedUser ? " #" + message.author.id : "#" + message.author.discriminator),
            avatar: avatar ? (" " + avatar).substring(1) : undefined, // avoid leak
        };
        this.emit("author", pauthor, this.lastMessageTimestampInFile);
        if (message.type == "Default" || message.type == "Reply") {
            let content = message.content;
            for (const mention of message.mentions) {
                // replace names by nicknames in mentions (to honor nicknames)
                // and just to make sure, replace spaces by underscores in the nickname and
                // add spaces in the sides so it can be picked correctly up by the Tokenizer
                content = content.split(`@${mention.name}`).join(` @${mention.nickname.replace(/\s/g, "_")} `);
            }
            // stickers may be undefined if the export was before stickers were added to DCE
            // TODO: in the far future we may want to make stats for platforms that support stickers (in their exports)
            const stickers = message.stickers || [];
            const pmessage = {
                id: message.id,
                authorId: message.author.id,
                channelId: this.lastChannelId,
                timestamp,
                timestampEdit,
                replyTo: message.reference?.messageId,
                textContent: content.length > 0 ? content : undefined,
                attachments: message.attachments
                    .map((a) => (0, Attachments_1.getAttachmentTypeFromFileName)(a.fileName))
                    .concat(stickers.map((_) => Attachments_1.AttachmentType.Sticker)),
                reactions: message.reactions.map((r) => {
                    const emojiId = r.emoji.id === null || r.emoji.id === "" ? undefined : r.emoji.id;
                    return [
                        {
                            id: emojiId,
                            text: r.emoji.name || emojiId || "unknown",
                        },
                        r.count,
                    ];
                }),
            };
            this.emit("message", pmessage, this.lastMessageTimestampInFile);
        }
    }
    /**
     * Parse a Discord Snowflake into its components
     *
     * See https://discord.com/developers/docs/reference#snowflakes
     */
    parseSnowflake(snowflake) {
        return {
            timestamp: BigInt(snowflake) >> BigInt(22),
            // complete when needed:
            // internalWorkerId
            // internalProcessId
            // increment
        };
    }
}
exports.DiscordParser = DiscordParser;
/**
 * Regex to find the timestamp of the last message in a Discord export file.
 * We use the timestamp of the last message as the `at` value (see @Parser)
 */
DiscordParser.TS_MSG_REGEX = /"timestamp": ?"([0-9-:.+T]+)"/gi;
