"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const events_1 = require("events");
/**
 * Tracks the progress of the generation.
 *
 * It stores two things:
 * - a stack of tasks and its status and progress
 * - key-value pairs of stats (e.g. files processed, messages processed, etc.)
 *
 * Every time progress is updated, it emits a "progress" event with the updated tasks and stats.
 *
 * The lifecycle of a task is:
 * - `new()`
 * - `progress()` (optional)
 * - ...
 * - `progress()` (optional)
 * - `success()` or `error()`
 *
 * Note: there is a undocumented and untested `waiting` state, which allows multiple `new` calls (unused)
 */
class Progress extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        /** All the tasks */
        this.tasks = [];
        /** Stats (global) */
        this.keys = {};
        /** Wether a task errored */
        this.errored = false;
        this.lastCount = 0;
        this.lastTs = 0;
    }
    /** Adds a new task */
    new(title, subject) {
        if (this.errored)
            throw new Error("Can't create new progress task after an error");
        const task = {
            status: "processing",
            title,
            subject,
        };
        if (this.active) {
            // mark the previous task as waiting
            this.active.status = "waiting";
        }
        this.active = task;
        this.tasks.push(task);
        this.update(true);
    }
    /** Updates the progress of the current task */
    progress(format, actual, total) {
        if (!this.active) {
            const prevTask = this.tasks
                .slice()
                .reverse()
                .find((t) => t.status === "waiting");
            if (prevTask) {
                const prevTaskCopy = JSON.parse(JSON.stringify(prevTask));
                prevTaskCopy.status = "processing";
                this.tasks.push(prevTaskCopy);
                this.active = prevTaskCopy;
            }
        }
        if (!this.active)
            throw new Error("No active task to update progress");
        this.active.progress = {
            actual,
            total,
            format,
        };
        // throttle updates
        this.update(false);
    }
    /** Marks the last task as finished and removes it from the stack */
    success() {
        if (!this.active)
            throw new Error("No active task to mark as success");
        this.active.status = "success";
        if (this.active.progress && this.active.progress.total) {
            // make sure to top up the progress
            this.active.progress.actual = this.active.progress.total;
        }
        this.active = undefined;
        this.update(true);
    }
    /** Marks the last task as failed */
    error(info) {
        if (!this.active)
            this.new("Error");
        this.active.status = "error";
        this.active.error = info;
        this.errored = true;
        this.update(true);
    }
    /** Set a stat value */
    stat(key, value) {
        if (this.keys[key] !== value) {
            const wasDefined = key in this.keys;
            this.keys[key] = value;
            this.update(!wasDefined);
        }
    }
    /**
     * Emits a "progress" event if progress advanced at least 1% or 15ms has passed since the last update.
     *
     * @param force wether to force the update
     */
    update(force) {
        let emit = force;
        let ts = 0;
        // throttle
        if (!emit && this.active && this.active.progress) {
            // try by %
            if (this.active.progress.total !== undefined) {
                const onePercent = this.active.progress.total * 0.01;
                emit = this.active.progress.actual - this.lastCount >= onePercent;
            }
            // try by time
            if (!emit) {
                ts = Date.now();
                emit = ts - this.lastTs > 15;
            }
        }
        if (emit) {
            this.emit("progress", this.tasks, this.keys);
            this.lastCount = this.active?.progress?.actual || 0;
            this.lastTs = ts || Date.now();
        }
    }
}
exports.Progress = Progress;
