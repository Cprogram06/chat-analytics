"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormatCache = exports.getDatabase = exports.getWorker = exports.initWorker = exports.WorkerWrapper = void 0;
const events_1 = require("events");
const Time_1 = require("@pipeline/Time");
/**
 * This class wraps the native Worker and handles initialization and communication.
 * It also keeps track of the active filters in the UI and sends them to the worker when a request is made.
 */
class WorkerWrapper extends events_1.EventEmitter {
    constructor(dataStr) {
        super();
        // active filters
        this.channelsSet = false;
        this.authorsSet = false;
        this.activeChannels = [];
        this.activeAuthors = [];
        /** Updated filters since last request */
        this.staleFilters = new Set(["authors", "channels", "time"]);
        /** Wether the worker is currently processing a request */
        this.workerBusy = false;
        if (env.isDev) {
            if (document.location.protocol === "blob:") {
                // this is when we are in a blob, in that case building the URL with import.meta.url will fail
                // so we use the following workaround to use the correct origin
                this.worker = new Worker(new URL(__webpack_require__.u("report_WorkerReport_ts"), document.location.origin));
            }
            else {
                // normal webpack v5 worker loading
                // @ts-expect-error
                this.worker = new Worker(new URL("@report/WorkerReport.ts", import.meta.url));
            }
        }
        else {
            // Why we use base64 instead of Blob+URL.createObjectURL?
            // Chrome Mobile crashes if you use createObjectURL from an .html file :)
            // See: https://bugs.chromium.org/p/chromium/issues/detail?id=1150828&q=createObjectURL%20crash
            // We can work around it using base64, so no requests are made
            // NOTE: data:application/javascript breaks
            const workerJs = document.getElementById("worker-script").textContent;
            this.worker = new Worker("data:application/javascript;base64," + btoa(unescape(encodeURIComponent(workerJs))));
        }
        this.worker.onerror = this.onError.bind(this);
        this.worker.onmessage = this.onMessage.bind(this);
        this.worker.postMessage({ type: "init", dataStr });
    }
    onError(e) {
        console.log(e);
        alert("An error occurred creating the WebWorker.\n\n Error: " + e.message);
        this.worker.terminate();
    }
    onMessage(e) {
        const res = e.data;
        if (res.type === "ready") {
            this.database = res.database;
            this.formatCache = res.formatCache;
            // set default time range
            this.activeStartDate = Time_1.Day.fromKey(res.database.time.minDate);
            this.activeEndDate = Time_1.Day.fromKey(res.database.time.maxDate);
            // worker is ready
            console.log("Worker is ready");
            this.emit("ready");
        }
        else if (res.type === "result") {
            this.workerBusy = false;
            // a result will be invialid if one of its triggers has been updated since the request was made
            const invalid = res.result.triggers.some((f) => this.staleFilters.has(f));
            this.emit("result", res.request, res.result, invalid);
        }
    }
    updateChannels(channels) {
        this.channelsSet = true;
        this.activeChannels = channels;
        this.staleFilters.add("channels");
        this.emit("filter-change", "channels");
    }
    updateAuthors(authors) {
        this.authorsSet = true;
        this.activeAuthors = authors;
        this.staleFilters.add("authors");
        this.emit("filter-change", "authors");
    }
    updateTimeRange(start, end) {
        const clampDate = (day) => Time_1.Day.clamp(day, Time_1.Day.fromKey(this.database.time.minDate), Time_1.Day.fromKey(this.database.time.maxDate));
        this.activeStartDate = clampDate(Time_1.Day.fromDate(start));
        this.activeEndDate = clampDate(Time_1.Day.fromDate(end));
        this.staleFilters.add("time");
        this.emit("filter-change", "time");
    }
    sendBlockRequest(request) {
        const br = {
            type: "request",
            request,
            filters: {},
        };
        // only update filters if they have changed
        if (this.staleFilters.has("channels")) {
            br.filters.channels = this.activeChannels;
            this.staleFilters.add("channels");
        }
        if (this.staleFilters.has("authors")) {
            br.filters.authors = this.activeAuthors;
            this.staleFilters.add("authors");
        }
        if (this.staleFilters.has("time")) {
            br.filters.startDate = this.activeStartDate?.dateKey;
            br.filters.endDate = this.activeEndDate?.dateKey;
            this.staleFilters.add("time");
        }
        // unmark stale, since we are updating them here
        this.staleFilters.clear();
        this.workerBusy = true;
        this.worker.postMessage(br);
    }
    getActiveStartDate() {
        return this.activeStartDate.toDate();
    }
    getActiveEndDate() {
        // we add one day because zoomToDates is [start, end)
        return this.activeEndDate.nextDay().toDate();
    }
    get areFiltersSet() {
        return this.channelsSet && this.authorsSet;
    }
    get available() {
        return this.workerBusy === false;
    }
}
exports.WorkerWrapper = WorkerWrapper;
let worker;
const initWorker = (dataStr) => (worker = new WorkerWrapper(dataStr));
exports.initWorker = initWorker;
const getWorker = () => worker;
exports.getWorker = getWorker;
const getDatabase = () => worker.database;
exports.getDatabase = getDatabase;
const getFormatCache = () => worker.formatCache;
exports.getFormatCache = getFormatCache;
