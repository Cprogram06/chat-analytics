"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexCountsBuilder = void 0;
/** Simplifies the creation of IndexCounts */
class IndexCountsBuilder {
    constructor() {
        this.data = {};
    }
    /** Increment count for index */
    incr(index, amount = 1) {
        this.data[index] = (this.data[index] || 0) + amount;
    }
    /**
     * Converts to an array of [index, count] pairs.
     *
     * For example, if `data` is:
     * ```
     * {
     *  1: 2,
     *  3: 4,
     *  5: 6
     * }
     * ```
     * then the result will be
     * ```
     * [
     *  [1, 2],
     *  [3, 4],
     *  [5, 6]
     * ]
     * ```
     *
     */
    toArray() {
        return Object.entries(this.data)
            .sort(([_1, a], [_2, b]) => b - a) // sort by count
            .map(([index, count]) => [parseInt(index), count]);
    }
    /**
     * Builds an IndexCountsBuilder from a list of indices.
     *
     * For example, if `list` is `[1, 4, 4, 1, 2, 4]`, then it will set the counts to be:
     * ```
     * {
     *  1: 2,
     *  2: 1,
     *  4: 3
     * }
     * ```
     */
    static fromList(list) {
        const counts = new IndexCountsBuilder();
        for (const index of list)
            counts.incr(index);
        return counts;
    }
}
exports.IndexCountsBuilder = IndexCountsBuilder;
