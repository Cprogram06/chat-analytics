"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEnv = exports.loadSamples = exports.loadSample = void 0;
const path_1 = __importDefault(require("path"));
const NodeEnv_1 = require("@lib/NodeEnv");
/**
 * Load a test sample
 *
 * @param filepath it expects the path relative to `@tests/samples`, e.g. `discord/DM_2A_2M.json`
 */
const loadSample = async (filepath) => {
    var _a;
    const samplePath = path_1.default.join(__dirname, filepath);
    const input = (0, NodeEnv_1.loadFile)(samplePath);
    try {
        const module = await (_a = samplePath + ".ts", Promise.resolve().then(() => __importStar(require(_a))));
        return {
            input,
            expectedParse: module.expectedParse,
            expectedDatabase: module.expectedDatabase,
        };
    }
    catch (e) {
        return { input };
    }
};
exports.loadSample = loadSample;
const loadSamples = (filepaths) => Promise.all(filepaths.map((fp) => (0, exports.loadSample)(fp)));
exports.loadSamples = loadSamples;
/** Common Env for running tests */
exports.TestEnv = { loadAsset: NodeEnv_1.loadNodeAsset };
