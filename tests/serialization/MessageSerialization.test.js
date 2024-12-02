"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BitStream_1 = require("@pipeline/serialization/BitStream");
const MessageSerialization_1 = require("@pipeline/serialization/MessageSerialization");
const Common_1 = require("@tests/serialization/Common");
describe("obj -> (serialize) -> (deserialize) -> obj", () => {
    test.each(Common_1.SAMPLE_MESSAGES)("%p", (message) => {
        const stream = new BitStream_1.BitStream();
        (0, MessageSerialization_1.writeMessage)(message, stream, MessageSerialization_1.DefaultMessageBitConfig);
        stream.offset = 0;
        const gotObj = (0, MessageSerialization_1.readMessage)(stream, MessageSerialization_1.DefaultMessageBitConfig);
        expect(gotObj).toStrictEqual(message);
    });
});
