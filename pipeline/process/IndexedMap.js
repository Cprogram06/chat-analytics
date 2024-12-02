"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedMap = void 0;
/**
 * This class keeps a linear array of values and a mapping between the key of the value and its index in the array.
 * It also allows to specify a `revision` for each value, so that always the most up-to-date value is kept.
 * It does not support removing values.
 */
class IndexedMap {
    constructor() {
        /** Mapping between keys and indexes */
        this.index = new Map();
        /** The linear array of values */
        this.array = [];
    }
    /**
     * Stores a value. If a value with the same key already exists, it will keep the one with highest `revision` value.
     * @returns the index of the value in the array
     */
    set(key, value, revision = Number.MIN_SAFE_INTEGER) {
        let info = this.index.get(key);
        if (info === undefined) {
            // add new value to array and index
            info = { revision: revision || Number.MIN_SAFE_INTEGER, index: this.array.length };
            this.index.set(key, info);
            this.array[info.index] = value;
        }
        else if (revision > info.revision) {
            // update revision and replace for newer value
            info.revision = revision;
            this.array[info.index] = value;
        }
        return info.index;
    }
    /** @returns the index of the value with the given key */
    getIndex(key) {
        return this.index.get(key)?.index;
    }
    /** @returns the value with the given key */
    getByIndex(idx) {
        return this.array[idx];
    }
    /** @returns the array containing all values */
    get values() {
        return this.array;
    }
    /** @returns the number of values stored */
    get size() {
        return this.array.length;
    }
}
exports.IndexedMap = IndexedMap;
