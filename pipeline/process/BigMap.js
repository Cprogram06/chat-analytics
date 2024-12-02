"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigMap = void 0;
// In V8, the maximum size of a Map is 2^24
const MAX_MAP_SIZE = Math.pow(2, 24) - 1; // (-1 just in case)
/**
 * A Map that can grow beyond the map size limit using multiple maps.
 */
class BigMap {
    constructor() {
        this.maps = [new Map()];
        // TODO: add more functionality as needed
    }
    get lastMap() {
        return this.maps[this.maps.length - 1];
    }
    set(key, value) {
        if (this.lastMap.size >= MAX_MAP_SIZE) {
            this.maps.push(new Map());
        }
        this.lastMap.set(key, value);
    }
    get(key) {
        // go backwards to ensure that the most recent values are returned first
        for (let i = this.maps.length - 1; i >= 0; i--) {
            const value = this.maps[i].get(key);
            if (value !== undefined) {
                return value;
            }
        }
        return undefined;
    }
}
exports.BigMap = BigMap;
