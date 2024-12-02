"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IndexCounts_1 = require("@pipeline/process/IndexCounts");
it("should count and sort correctly", () => {
    const counts = new IndexCounts_1.IndexCountsBuilder();
    counts.incr(3, 3);
    counts.incr(2);
    counts.incr(1, 2);
    expect(counts.toArray()).toStrictEqual([
        [3, 3],
        [1, 2],
        [2, 1],
    ]);
});
it("should count correctly creating from list", () => {
    expect(IndexCounts_1.IndexCountsBuilder.fromList([1, 4, 4, 1, 2, 4]).toArray()).toStrictEqual([
        [4, 3],
        [1, 2],
        [2, 1],
    ]);
});
