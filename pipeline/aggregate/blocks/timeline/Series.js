"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSeries = void 0;
/** Generates the series that should be displayed */
const generateSeries = (db) => {
    return [
        // keep guilds that have a channel that is NOT a DM/group
        ...db.guilds
            .map((guild, guildIndex) => ({ guild, guildIndex }))
            .filter(({ guildIndex }) => db.channels.some((c) => c.guildIndex === guildIndex && c.type === "text"))
            .map(({ guild, guildIndex }) => ({
            title: guild.name,
            guildIndex,
        })),
        // add all groups as series
        ...db.channels
            .map((channel, channelIndex) => ({ channel, channelIndex }))
            .filter(({ channel }) => channel.type === "group")
            .map(({ channel, channelIndex }) => ({
            title: channel.name,
            channelIndex,
        })),
    ];
};
exports.generateSeries = generateSeries;
