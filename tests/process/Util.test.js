"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("@pipeline/process/Util");
test.each([
    [
        [3, 2, 1],
        [0, 1, 2],
    ],
    [
        [1, 2, 3],
        [2, 1, 0],
    ],
    [
        [5, 4, 1, 6, 3, 2],
        [1, 2, 5, 0, 3, 4],
    ],
])("`rank` sorts as expected %p → %p", (input, expected) => {
    expect((0, Util_1.rank)(input)).toEqual(expected);
});
test("`rank` filters out negative values as -1", () => {
    const values = [-1, 4, -1, -1, 2, 3];
    const expected = [-1, 0, -1, -1, 2, 1];
    expect((0, Util_1.rank)(values)).toEqual(expected);
});
test.each([
    [
        [1, 2, 3],
        [30, 20, 10],
    ],
    [
        [5, 4, 1, 6, 3, 2],
        [60, 50, 40, 30, 20, 10],
    ],
])("`remap` works as expected %p → %p", (input, expected) => {
    // using rank it ends up being the same as a sort
    expect((0, Util_1.remap)((v) => v * 10, input, (0, Util_1.rank)(input))).toEqual(expected);
});
test("`remap` does not return undefined when some ranks are undefined", () => {
    const input = [3, -1, -1, 2, 4, -1];
    const expected = [40, 30, 20];
    expect((0, Util_1.remap)((v) => v * 10, input, (0, Util_1.rank)(input))).toEqual(expected);
});
