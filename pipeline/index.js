"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = exports.generateDatabase = void 0;
const Compression_1 = require("@pipeline/compression/Compression");
const DatabaseBuilder_1 = require("@pipeline/process/DatabaseBuilder");
/**
 * Generates a Database object from the given files and configuration.
 *
 * The entry point for chat-analytics if you want to use it as a library.
 */
const generateDatabase = async (files, config, env) => {
    const builder = new DatabaseBuilder_1.DatabaseBuilder(config, env);
    await builder.init();
    await builder.processFiles(files);
    return builder.build();
};
exports.generateDatabase = generateDatabase;
/** Takes a Database object and generates the report HTML code. It also returns the compressed data */
const generateReport = async (database, env) => {
    // compress data
    env.progress?.new("Compressing");
    const encodedData = (0, Compression_1.compressDatabase)(database);
    env.progress?.success();
    // build title to avoid HTML injections (just so it doesn't break)
    const title = database.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let html = await env.loadAsset("/report.html", "text");
    html = html.replace("[[TITLE]]", `${title} - Chat Analytics`);
    // we can't use replace for the data, if the data is too large it will cause a crash
    const template = "[[[DATA]]]";
    const dataTemplateLoc = html.indexOf(template);
    const finalHtml = html.slice(0, dataTemplateLoc) + encodedData + html.slice(dataTemplateLoc + template.length);
    return {
        data: encodedData,
        html: finalHtml,
    };
};
exports.generateReport = generateReport;
