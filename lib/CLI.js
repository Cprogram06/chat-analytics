#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = __importDefault(require("fs"));
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const NodeEnv_1 = require("@lib/NodeEnv");
const index_1 = require("@lib/index");
const Progress_1 = require("@pipeline/Progress");
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .scriptName("chat-analytics")
    .usage("Usage: $0 -p <platform> -i <input files>")
    .option("platform", {
    alias: "p",
    description: "The platform to generate for",
    choices: ["discord", "messenger", "telegram", "whatsapp"],
    type: "string",
    demandOption: true,
})
    .option("inputs", {
    alias: "i",
    description: "The input file(s) to use (glob)",
    type: "array",
    demandOption: true,
})
    .option("output", {
    alias: "o",
    description: "The output HTML filename",
    type: "string",
    default: "report.html",
})
    .option("demo", {
    description: "Mark the report as a demo",
    type: "boolean",
    default: false,
})
    .epilogue(`For more information visit: https://github.com/mlomb/chat-analytics\nOr use the app online: https://chatanalytics.app`)
    .parseSync();
const files = fast_glob_1.default.sync(argv.inputs.map((i) => i + ""), { onlyFiles: true });
console.log("Target platform:", argv.platform);
console.log("Demo: " + argv.demo);
console.log("Output file:", argv.output);
console.log("Input files:");
for (const file of files) {
    console.log(` [*] ${file}`);
}
// run
const config = {
    platform: argv.platform,
    demo: argv.demo,
};
const NodeEnv = {
    loadAsset: NodeEnv_1.loadNodeAsset,
    progress: new Progress_1.Progress(),
};
// } satisfies Env;
let lastTaskDisplayed = 0;
NodeEnv.progress.on("progress", (tasks, stats) => {
    const idx = tasks.length - 1;
    const { title, subject, progress } = tasks[idx];
    let line = title + (subject ? `: ${subject}` : "");
    if (progress) {
        const format = progress.format === "bytes" ? pretty_bytes_1.default : (n) => n.toLocaleString();
        line += " ";
        line += format(progress.actual);
        if (progress.total)
            line += `/${format(progress.total)}`;
    }
    if (process.stdout.isTTY) {
        if (lastTaskDisplayed < idx) {
            lastTaskDisplayed = idx;
            process.stdout.write("\n");
        }
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(line);
    }
    else {
        if (lastTaskDisplayed < idx) {
            lastTaskDisplayed = idx;
            console.log(line);
        }
    }
});
(async () => {
    console.log("Generating report...");
    console.time("Done");
    const db = await (0, index_1.generateDatabase)(files.map(NodeEnv_1.loadFile), config, NodeEnv);
    const result = await (0, index_1.generateReport)(db, NodeEnv);
    if (process.stdout.isTTY)
        process.stdout.write("\n");
    console.timeEnd("Done");
    fs_1.default.writeFileSync(argv.output, result.html, "utf8");
    console.log("Report data size: " + (0, pretty_bytes_1.default)(result.data.length));
    console.log("Report HTML size: " + (0, pretty_bytes_1.default)(result.html.length));
    console.log("The report contains:");
    console.log(` [*] ${db.numMessages} messages`);
    console.log(` [*] ${db.authors.length} authors`);
    console.log(` [*] ${db.channels.length} channels`);
    console.log(` [*] ${db.guilds.length} guilds`);
})();
