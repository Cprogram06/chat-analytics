"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Blocks_1 = require("@pipeline/aggregate/Blocks");
const Common_1 = require("@pipeline/aggregate/Common");
const Filters_1 = require("@pipeline/aggregate/Filters");
const Compression_1 = require("@pipeline/compression/Compression");
const Text_1 = require("@pipeline/process/nlp/Text");
let database = null;
let filters = null;
let common = null;
const init = (msg) => {
    console.time("Decompress time");
    database = (0, Compression_1.decompressDatabase)(msg.dataStr);
    console.timeEnd("Decompress time");
    console.time("Compute common block data");
    common = (0, Common_1.computeCommonBlockData)(database);
    console.timeEnd("Compute common block data");
    filters = new Filters_1.Filters(database);
    console.time("Build format cache");
    // We don't want to stall the UI computing this, so we have to do it in the worker.
    // We could treat FormatCache as another block and manage it in the UI,
    // but it's too much trouble imo, just do it here
    const formatCache = {
        authors: database.authors.map((author) => (0, Text_1.matchFormat)(author.n)),
        channels: database.channels.map((channel) => (0, Text_1.matchFormat)(channel.name)),
        words: database.words.map((word) => (0, Text_1.matchFormat)(word)),
        emojis: database.emojis.map((emoji) => (0, Text_1.matchFormat)(emoji.name)),
        mentions: database.mentions.map((mention) => (0, Text_1.matchFormat)(mention)),
    };
    console.timeEnd("Build format cache");
    const message = {
        type: "ready",
        database: {
            ...database,
            // since we don't need serialized messages in the UI
            // and they are huge, let's remove them
            // @ts-expect-error
            messages: undefined,
        },
        formatCache,
    };
    self.postMessage(message);
    if (env.isDev)
        console.log(database);
};
const request = async (msg) => {
    if (!database || !filters || !common)
        throw new Error("No data provided");
    // update active filters if provided
    if (msg.filters.channels)
        filters.updateChannels(msg.filters.channels);
    if (msg.filters.authors)
        filters.updateAuthors(msg.filters.authors);
    if (msg.filters.startDate)
        filters.updateStartDate(msg.filters.startDate);
    if (msg.filters.endDate)
        filters.updateEndDate(msg.filters.endDate);
    const request = msg.request;
    const resultMsg = {
        type: "result",
        request,
        result: {
            success: false,
            triggers: [],
            errorMessage: "Unknown error",
        },
    };
    try {
        if (!(request.blockKey in Blocks_1.Blocks))
            throw new Error("BlockFn not found");
        // set triggers
        resultMsg.result.triggers = Blocks_1.Blocks[request.blockKey].triggers;
        const id = request.blockKey + (request.args ? "--" + JSON.stringify(request.args) : "");
        console.time(id);
        // @ts-expect-error (BlockArgs<any>)
        const data = Blocks_1.Blocks[request.blockKey].fn(database, filters, common, request.args);
        console.timeEnd(id);
        console.log(data);
        resultMsg.result.success = true;
        resultMsg.result.data = data;
        resultMsg.result.errorMessage = undefined;
    }
    catch (ex) {
        // handle exceptions
        resultMsg.result.errorMessage = ex instanceof Error ? ex.message : ex + "";
        console.log("Error ahead ↓");
        console.error(ex);
    }
    self.postMessage(resultMsg);
};
self.onmessage = (ev) => {
    switch (ev.data.type) {
        case "init":
            init(ev.data);
            break;
        case "request":
            request(ev.data);
            break;
        default:
            console.log("Unknown message", ev.data);
    }
};
console.log("WorkerReport started");
