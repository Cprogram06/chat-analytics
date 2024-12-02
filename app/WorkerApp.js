"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebEnv_1 = require("@app/WebEnv");
const index_1 = require("@pipeline/index");
self.onmessage = async (ev) => {
    const { progress } = WebEnv_1.WebEnv;
    progress.on("progress", (tasks, stats) => self.postMessage({
        type: "progress",
        tasks,
        stats,
    }));
    try {
        const database = await (0, index_1.generateDatabase)(ev.data.files.map(WebEnv_1.wrapFile), ev.data.config, WebEnv_1.WebEnv);
        if (env.isDev)
            console.log(database);
        const result = await (0, index_1.generateReport)(database, WebEnv_1.WebEnv);
        if (env.isDev) {
            // include the origin in relative URLs, so it can be opened locally
            // e.g. http://localhost:8080
            result.html = result.html
                .replace('<script defer src="', '<script defer src="' + ev.data.origin)
                .replace('<link href="', '<link href="' + ev.data.origin);
        }
        const message = {
            type: "result",
            data: env.isDev ? result.data : "",
            html: result.html,
            title: database.title,
            lang: database.langs.length > 0 ? database.langs[0] : "",
            counts: {
                messages: database.numMessages,
                authors: database.authors.length,
                channels: database.channels.length,
                guilds: database.guilds.length,
            },
        };
        self.postMessage(message);
    }
    catch (ex) {
        // handle exceptions
        if (ex instanceof Error) {
            progress.error(ex.message);
        }
        else {
            progress.error(ex + "");
        }
        console.log("Error ahead ↓");
        console.error(ex);
    }
};
console.log("WorkerApp started");
