"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base91_1 = require("@pipeline/compression/Base91");
test.each([128, 256, 12345, 99999])("should encode and decode correctly len=%i", (len) => {
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++)
        buffer[i] = i % 256;
    const encoded = (0, Base91_1.base91encode)(buffer);
    const decoded = (0, Base91_1.base91decode)(encoded);
    expect(decoded.byteLength).toEqual(buffer.byteLength);
    expect(buffer.every((v, i) => v === decoded[i])).toBe(true);
});
