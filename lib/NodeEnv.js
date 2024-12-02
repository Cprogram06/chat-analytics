"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadNodeAsset = exports.loadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/** Loads a file from disk and wraps it into our file abstraction */
const loadFile = (filepath) => {
    const stats = fs_1.default.statSync(filepath);
    const fd = fs_1.default.openSync(filepath, "r");
    return {
        name: filepath,
        size: stats.size,
        lastModified: stats.mtimeMs,
        slice: async (start, end) => {
            start = start ?? 0;
            end = end ?? stats.size;
            const buffer = Buffer.alloc(end - start);
            fs_1.default.readSync(fd, buffer, {
                length: end - start,
                position: start,
            });
            return buffer;
        },
    };
};
exports.loadFile = loadFile;
/** Loads assets when running in a NodeJS process */
const loadNodeAsset = async (filepath, type) => {
    let rootDir;
    if (process.env.NODE_ENV === "test") {
        // during tests, the tests are run from the original .ts files
        rootDir = path_1.default.join(__dirname, "..");
    }
    else {
        // otherwise, the package is deployed in dist/
        rootDir = path_1.default.join(__dirname, "..", "..");
    }
    filepath = path_1.default.join(rootDir, "assets", filepath);
    // hardcode the report.html file
    // we probably don't want to do this, but because all assets live inside the assets folder
    // and the report is generated in dist_web/ is a bit of a pain
    if (filepath.endsWith("report.html")) {
        // we assume we don't test with the report.html file
        filepath = path_1.default.join(rootDir, "dist_web", "report.html");
    }
    const content = fs_1.default.readFileSync(filepath);
    if (type === "text")
        return content.toString("utf-8");
    else if (type === "json")
        return JSON.parse(content.toString("utf-8"));
    else
        return content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
};
exports.loadNodeAsset = loadNodeAsset;
