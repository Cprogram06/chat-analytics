"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.tokenizeStep = exports.splitByToken = void 0;
const emoji_regex_1 = __importDefault(require("emoji-regex"));
// the order of the matchers is critical
const Matchers = [
    {
        // should we handle it this way?
        // source code, ascii art, some other stuff should not be included
        regex: /```[^`]*```/g,
        tag: "code",
    },
    {
        // match URLs
        regex: /https?:\/\/[^\s<]+[^<.,:;"')\]\s]/g,
        tag: "url",
    },
    // TODO: match emails, so they are not parsed as mentions (@gmail, @hotmail, etc)
    {
        // match @mentions
        regex: /@[\p{L}_0-9]+/giu,
        tag: "mention",
        transform: (match) => match.slice(1), // remove @
    },
    {
        // match emojis 🔥
        regex: (0, emoji_regex_1.default)(),
        tag: "emoji",
    },
    {
        // match custom emojis :pepe:
        regex: /:\w+:/gi,
        tag: "custom-emoji",
        transform: (match) => match.slice(1, -1), // remove :
    },
    // TODO: match words on languages that words are one character (help wanted)
    // See: https://github.com/facebookresearch/fastText/blob/master/docs/crawl-vectors.md#tokenization
    {
        // match words
        // words can have numbers (k8s, i18n, etc) (is this a mistake?)
        regex: /(?:\p{L}[\p{L}'0-9-]*[\p{L}0-9])|\p{L}/giu,
        tag: "word",
    },
];
/**
 * Splits the input string using one TokenMatcher into a list of strings and tokens where:
 * - strings are the parts of the input that do not match the matcher (trimmed)
 * - tokens are the parts of the input that do match the matcher (@see Token)
 *
 * For example, if the matcher matches emojis:
 * > "hello world" -> ["hello world"]
 * > "😃" -> [{ ..."😃" }]
 * > "notemoji 😃 notemoji" -> ["notemoji", { ..."😃" }, "notemoji"]
 */
const splitByToken = (input, matcher) => {
    const result = [];
    const matches = input.match(matcher.regex);
    const remaining = input.split(matcher.regex);
    // interleave the matched and unmatched
    for (let i = 0; i < remaining.length; i++) {
        // unmatched string
        const unmatched = remaining[i].trim();
        if (unmatched.length > 0)
            result.push(unmatched);
        // matched token
        if (matches && i < matches.length) {
            result.push({
                text: matcher.transform ? matcher.transform(matches[i]) : matches[i],
                tag: matcher.tag,
            });
        }
    }
    return result;
};
exports.splitByToken = splitByToken;
/**
 * Tokenizes a string recursively.
 * It is assumed that all matchers with index `< matcherIndex` have already been
 * tried and failed to match, so we are clear to test for matchers `>= matcherIndex`.
 *
 * @param matcherIndex the index of the matcher to use in the Matchers array
 */
const tokenizeStep = (input, matcherIndex) => {
    if (matcherIndex >= Matchers.length) {
        // no more matchers to try, mark as unknown
        return [{ text: input, tag: "unknown" }];
    }
    const result = [];
    // split input by the matcher
    const list = (0, exports.splitByToken)(input, Matchers[matcherIndex]);
    // now recursively tokenize with the remaining matchers
    // when the element is a string (aka unmatched)
    for (const elem of list) {
        if (typeof elem === "string") {
            // continue tokenizing
            result.push(...(0, exports.tokenizeStep)(elem, matcherIndex + 1));
        }
        else {
            result.push(elem);
        }
    }
    return result;
};
exports.tokenizeStep = tokenizeStep;
/** Tokenizes a string into a list of tokens */
const tokenize = (input) => (0, exports.tokenizeStep)(input, 0);
exports.tokenize = tokenize;
