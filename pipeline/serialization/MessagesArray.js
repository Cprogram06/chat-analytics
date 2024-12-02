"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesArray = void 0;
const BitStream_1 = require("@pipeline/serialization/BitStream");
const MessageSerialization_1 = require("@pipeline/serialization/MessageSerialization");
/**
 * Acts just like an array, but it serializes the messages to a BitStream to improve memory usage and performance.
 *
 * It needs a `MessageBitConfig` to know the bit configuration of the messages.
 */
class MessagesArray {
    /**
     * Creates an array. You can provide an existing stream.
     *
     * @param count the number of messages in the stream
     */
    constructor(bitConfig, stream, count) {
        this.bitConfig = bitConfig;
        if (stream) {
            if (count === undefined)
                throw new Error("Count is required");
            this.stream = stream;
            this.length = count;
            this.startOffset = stream.offset;
        }
        else {
            // empty
            this.stream = new BitStream_1.BitStream();
            this.length = 0;
            this.startOffset = 0;
        }
    }
    /** Adds a message at the end */
    push(item) {
        (0, MessageSerialization_1.writeMessage)(item, this.stream, this.bitConfig);
        this.length++;
    }
    /**
     *  Iterates over all messages in the array.
     *
     * ⚠️ You can't call this method and push messages at the same time, since we are changing the stream offset.
     */
    *[Symbol.iterator]() {
        // save and later restore the current stream offset
        const originalOffset = this.stream.offset;
        this.stream.offset = this.startOffset; // start from the beginning
        for (let i = 0; i < this.length; i++) {
            yield (0, MessageSerialization_1.readMessage)(this.stream, this.bitConfig);
        }
        this.stream.offset = originalOffset;
    }
    /** @returns the number of bytes occupied by the messages */
    get byteLength() {
        return this.stream.offset - this.startOffset;
    }
}
exports.MessagesArray = MessagesArray;
