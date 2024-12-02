"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BitStream_1 = require("@pipeline/serialization/BitStream");
const MessageSerialization_1 = require("@pipeline/serialization/MessageSerialization");
const MessagesArray_1 = require("@pipeline/serialization/MessagesArray");
const TEST_MESSAGES = [
    {
        dayIndex: 123,
        secondOfDay: 4,
        authorIndex: 8,
    },
    {
        dayIndex: 321,
        secondOfDay: 4,
        authorIndex: 8,
    },
];
test("push elements and be able to iterate them", () => {
    const arr = new MessagesArray_1.MessagesArray(MessageSerialization_1.DefaultMessageBitConfig);
    const gotArr = [];
    for (const item of TEST_MESSAGES)
        arr.push(item);
    for (const item of arr)
        gotArr.push(item);
    expect(gotArr).toStrictEqual(TEST_MESSAGES);
});
test("iterate from existing stream", () => {
    const stream = new BitStream_1.BitStream();
    for (const item of TEST_MESSAGES)
        (0, MessageSerialization_1.writeMessage)(item, stream, MessageSerialization_1.DefaultMessageBitConfig);
    stream.offset = 0;
    const arr = new MessagesArray_1.MessagesArray(MessageSerialization_1.DefaultMessageBitConfig, stream, TEST_MESSAGES.length);
    const gotArr = [];
    for (const item of arr)
        gotArr.push(item);
    expect(gotArr).toStrictEqual(TEST_MESSAGES);
});
it("should throw if count is not provided", () => {
    expect(() => new MessagesArray_1.MessagesArray(MessageSerialization_1.DefaultMessageBitConfig, new BitStream_1.BitStream())).toThrow();
});
