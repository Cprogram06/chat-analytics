"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("@pipeline/aggregate/Helpers");
const fn = (database, filters, common, args) => {
    let totalWithLang = 0;
    let totalWords = 0;
    const languagesCount = new Array(255).fill(0);
    const wordsCount = new Array(database.words.length).fill(0);
    const uniqueWords = new Set();
    const processMessage = (msg) => {
        if (msg.langIndex !== undefined) {
            totalWithLang++;
            languagesCount[msg.langIndex]++;
        }
        const words = msg.words;
        if (words) {
            for (const word of words) {
                wordsCount[word[0]] += word[1];
                totalWords += word[1];
                uniqueWords.add(word[0]);
            }
        }
    };
    (0, Helpers_1.filterMessages)(processMessage, database, filters);
    // lang
    const langThreshold = Math.max(1, totalWithLang * 0.03); // at least 3% to be reliable
    const allLanguages = languagesCount.map((count, index) => ({ index, value: count }));
    const totalUnreliable = allLanguages
        .filter((lang) => lang.value < langThreshold)
        .reduce((sum, lang) => sum + lang.value, 0);
    const languageList = allLanguages.filter((lang) => lang.value >= langThreshold);
    languageList.push({ index: 0, value: totalUnreliable });
    languageList.sort((a, b) => b.value - a.value);
    return {
        languages: languageList,
        totalWords,
        uniqueWords: uniqueWords.size,
        avgWordsPerMessage: totalWords / totalWithLang,
        wordsCount,
    };
};
exports.default = {
    key: "language/stats",
    triggers: ["authors", "channels", "time"],
    fn,
};
