"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompressDatabase = exports.compressDatabase = void 0;
const fflate_1 = require("fflate");
const Base91_1 = require("@pipeline/compression/Base91");
/**
 * Compress and encode the database into a string
 *
 * ((POJO -> TextEncoder) + Binary) -> Gzip -> Base91
 */
const compressDatabase = (database) => {
    // variables must be declared with let and not const
    // so we can release the memory when we are done with them
    let messages = database.messages;
    let json = JSON.stringify({
        ...database,
        // do not include messages in the JSON
        messages: undefined,
    });
    let jsonBuffer = new TextEncoder().encode(json);
    json = undefined; // release json string
    // Raw buffer format:
    //      <json buffer length> <messages length>
    //      <json buffer>        <messages buffer>
    let rawBuffer = new Uint8Array(4 * 2 + jsonBuffer.byteLength + messages.byteLength);
    let rawView = new DataView(rawBuffer.buffer);
    // write lengths
    rawView.setUint32(0, jsonBuffer.length);
    rawView.setUint32(4, messages.byteLength);
    // write buffers
    rawBuffer.set(jsonBuffer, 8);
    rawBuffer.set(messages, 8 + jsonBuffer.length);
    // release buffer
    jsonBuffer = undefined;
    let zippedBuffer = (0, fflate_1.gzipSync)(rawBuffer);
    rawBuffer = undefined;
    let encoded = (0, Base91_1.base91encode)(zippedBuffer);
    zippedBuffer = undefined;
    return encoded;
};
exports.compressDatabase = compressDatabase;
/**
 * Decode and decompress the database from a string
 *
 * Base91 -> Gunzip -> ((TextDecoder -> JSON.parse) + Binary)
 */
const decompressDatabase = (data) => {
    const decoded = (0, Base91_1.base91decode)(data);
    const rawBuffer = (0, fflate_1.gunzipSync)(decoded);
    const rawView = new DataView(rawBuffer.buffer);
    // read lengths
    const jsonBufferLength = rawView.getUint32(0);
    const messagesLength = rawView.getUint32(4);
    // read buffers
    const jsonBuffer = rawBuffer.slice(8, 8 + jsonBufferLength);
    const messages = rawBuffer.slice(8 + jsonBufferLength, 8 + jsonBufferLength + messagesLength);
    const jsonString = new TextDecoder().decode(jsonBuffer);
    const database = JSON.parse(jsonString);
    database.messages = messages;
    return database;
};
exports.decompressDatabase = decompressDatabase;
