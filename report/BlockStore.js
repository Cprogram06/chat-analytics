"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockStore = exports.initBlockStore = exports.BlockStore = exports.idRequest = void 0;
const WorkerWrapper_1 = require("@report/WorkerWrapper");
/** Generates a unique identifier for a block request */
const idRequest = (request) => {
    if (request === undefined)
        return "undefined";
    // TODO: fix JSON stringify may not produce the same string for identical objects
    // for now we don't have arguments with more than one key so it's fine
    return request.blockKey + "--" + JSON.stringify(request.args);
};
exports.idRequest = idRequest;
/**
 * Block storage and management.
 * It tracks computed blocks and dispatches work to the worker.
 *
 * The way it works is a two step process:
 * 1. You have to subscribe (with `subscribe`) to a block to get notified of status changes
 * 2. You have to enable (with `enable`) a block to make it be computed
 */
class BlockStore {
    constructor(worker) {
        this.worker = worker;
        /** Subscribers of blocks */
        this.blockListeners = new Map();
        /** Currently enabled requests (that means in view and should be processed eventually) */
        this.enabledBlocks = [];
        /** Requests computed and up to date (not invalidated) */
        this.storedBlocks = new Map();
        /** Requests last broadcasted state (valid and invalidated) */
        this.lastBroadcastedState = new Map();
        /** Which requests must be marked as stale after a filter changes */
        this.filterDependencies = {
            authors: new Set(),
            channels: new Set(),
            time: new Set(),
        };
        worker.on("ready", this.tryToDispatchWork.bind(this));
        worker.on("filter-change", this.onFilterChange.bind(this));
        worker.on("result", this.onWorkDone.bind(this));
    }
    onFilterChange(trigger) {
        // mark all blocks that depend on this trigger as stale
        for (const reqId of this.filterDependencies[trigger]) {
            this.storedBlocks.delete(reqId);
            this.update(reqId, { state: "waiting" });
        }
        // recompute
        this.tryToDispatchWork();
    }
    onWorkDone(request, result, invalid) {
        if (invalid) {
            // the block was invalidated while being computed
            this.update((0, exports.idRequest)(request), { state: "waiting" });
        }
        else {
            // the block is valid
            this.update((0, exports.idRequest)(request), {
                state: result.success ? "ready" : "error",
                data: result.data,
                error: result.errorMessage,
            });
            for (const trigger of result.triggers) {
                this.filterDependencies[trigger].add((0, exports.idRequest)(request));
            }
        }
        // try to dispatch more work
        this.tryToDispatchWork();
    }
    subscribe(request, listener) {
        const id = (0, exports.idRequest)(request);
        let listeners = this.blockListeners.get(id);
        if (!listeners) {
            listeners = new Set();
            this.blockListeners.set(id, listeners);
        }
        listeners.add(listener);
    }
    unsubscribe(request, listener) {
        const listeners = this.blockListeners.get((0, exports.idRequest)(request));
        listeners?.delete(listener);
    }
    enable(request) {
        this.enabledBlocks.push(request);
        this.tryToDispatchWork();
    }
    disable(request) {
        const id = (0, exports.idRequest)(request);
        // remove first occurrence by id
        const index = this.enabledBlocks.findIndex((r) => id === (0, exports.idRequest)(r));
        if (index >= 0)
            this.enabledBlocks.splice(index, 1);
    }
    tryToDispatchWork() {
        if (this.worker.areFiltersSet === false) {
            // we need to wait for the UI to set the filters
            return;
        }
        // pick an active block that is not ready
        const pendingRequests = this.enabledBlocks
            .map(exports.idRequest)
            .filter((id) => !this.storedBlocks.has(id) || this.storedBlocks.get(id)?.state === "waiting");
        // if there is pending work and the worker is available
        if (pendingRequests.length > 0 && this.worker.available) {
            const id = pendingRequests[0];
            const request = this.enabledBlocks.find((r) => id === (0, exports.idRequest)(r));
            // work goes brrr
            this.dispatchWork(request);
        }
    }
    dispatchWork(request) {
        // notify that this block is loading
        this.update((0, exports.idRequest)(request), { state: "processing" });
        // dispatch work
        this.worker.sendBlockRequest(request);
    }
    update(id, status) {
        // check if the status changed (and its not ready since data may change)
        if (status.state !== "ready" && this.lastBroadcastedState.get(id) === status.state)
            return;
        // store block result in case it is needed later
        this.storedBlocks.set(id, status);
        this.lastBroadcastedState.set(id, status.state);
        // and notify the UI
        const listeners = this.blockListeners.get(id);
        listeners?.forEach((listener) => listener(status));
    }
    getStoredStatus(request) {
        const status = this.storedBlocks.get((0, exports.idRequest)(request));
        if (status)
            return status;
        return { state: "waiting" };
    }
}
exports.BlockStore = BlockStore;
let blockStore;
const initBlockStore = () => (blockStore = new BlockStore((0, WorkerWrapper_1.getWorker)()));
exports.initBlockStore = initBlockStore;
const getBlockStore = () => blockStore;
exports.getBlockStore = getBlockStore;
