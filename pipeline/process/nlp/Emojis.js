"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emojis = void 0;
/** Emojis database */
class Emojis {
    constructor(data) {
        this.data = data;
    }
    /** Returns the name of an emoji e.g. 💓 → "beating heart" */
    getName(emoji) {
        return this.data[emoji] ? this.data[emoji].n : emoji;
    }
    /** Returns the sentiment of an emoji. e.g. 😡 → negative, ❤ → positive, 🟪 → 0. Always [-1, 1] */
    getSentiment(emoji) {
        return this.data[emoji]?.s || 0;
    }
    static async load(env) {
        return new Emojis(await env.loadAsset("/data/emojis/emoji-data.json", "json"));
    }
}
exports.Emojis = Emojis;
