"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BitStream_1 = require("@pipeline/serialization/BitStream");
const MessageSerialization_1 = require("@pipeline/serialization/MessageSerialization");
const MessageView_1 = require("@pipeline/serialization/MessageView");
const Common_1 = require("@tests/serialization/Common");
describe("should deserialize correctly", () => {
    test.each(Common_1.SAMPLE_MESSAGES)("%p", (message) => {
        const stream = new BitStream_1.BitStream();
        (0, MessageSerialization_1.writeMessage)(message, stream, MessageSerialization_1.DefaultMessageBitConfig);
        stream.offset = 0;
        const view = new MessageView_1.MessageView(stream, MessageSerialization_1.DefaultMessageBitConfig);
        for (const key of Common_1.MESSAGE_KEYS) {
            expect(view[key]).toStrictEqual(message[key]);
        }
        expect(view.getFullMessage()).toMatchObject(message);
    });
});
it("should link replies correctly", () => {
    const stream = new BitStream_1.BitStream();
    let offsetOfSecondMessage = 0;
    for (let i = 0; i < Common_1.SAMPLE_MESSAGES.length; i++) {
        if (i === 1)
            offsetOfSecondMessage = stream.offset;
        (0, MessageSerialization_1.writeMessage)(Common_1.SAMPLE_MESSAGES[i], stream, MessageSerialization_1.DefaultMessageBitConfig);
    }
    let offsetOfTestMessage = stream.offset;
    (0, MessageSerialization_1.writeMessage)({
        dayIndex: 1,
        secondOfDay: 2,
        authorIndex: 3,
        langIndex: 4,
        sentiment: 5,
        replyOffset: offsetOfSecondMessage,
    }, stream, MessageSerialization_1.DefaultMessageBitConfig);
    stream.offset = offsetOfTestMessage;
    const view = new MessageView_1.MessageView(stream, MessageSerialization_1.DefaultMessageBitConfig);
    expect(view.hasReply).toBeTruthy();
    expect(view.replyOffset).toBe(offsetOfSecondMessage);
    expect(view.reply).toBeDefined();
    expect(view.reply.getFullMessage()).toMatchObject(Common_1.SAMPLE_MESSAGES[1]);
    expect(view.reply.reply).toBeUndefined();
});
