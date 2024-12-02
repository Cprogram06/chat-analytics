"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createYAxisLabel = exports.createXAxisLabel = exports.enableDebouncedResize = exports.syncAxisWithTimeFilter = exports.Themes = void 0;
const amcharts5_1 = require("@amcharts/amcharts5");
const Animated_1 = __importDefault(require("@amcharts/amcharts5/themes/Animated"));
const Dark_1 = __importDefault(require("@amcharts/amcharts5/themes/Dark"));
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const Themes = (root, animated) => animated ? [Animated_1.default.new(root), Dark_1.default.new(root)] : [Dark_1.default.new(root)];
exports.Themes = Themes;
/** Syncs the X-axis with the time filter, so the chart is zoomed to the current time filter. */
const syncAxisWithTimeFilter = (series, xAxis, yAxis) => {
    const worker = (0, WorkerWrapper_1.getWorker)();
    // since we are syncing the axis, we don't want the zoom out button
    xAxis.chart?.zoomOutButton.set("forceHidden", true);
    const onZoom = () => xAxis.zoomToDates(worker.getActiveStartDate(), worker.getActiveEndDate(), 0);
    const onFilterChange = (filter) => {
        if (filter === "time")
            onZoom();
    };
    worker.on("filter-change", onFilterChange);
    series.forEach((s) => {
        // must wait for datavalidated before zooming
        s.events.once("datavalidated", onZoom);
        // See: https://github.com/amcharts/amcharts5/issues/236
        s.events.on("datavalidated", () => yAxis.zoom(0, 1));
    });
    return () => {
        worker.off("filter-change", onFilterChange);
    };
};
exports.syncAxisWithTimeFilter = syncAxisWithTimeFilter;
/** Makes the chart resize operation debounced. Note that it does not resize charts that are out of view. */
const enableDebouncedResize = (root, waitTime = 150) => {
    root.autoResize = false;
    let timeoutID;
    const onResize = () => {
        if (timeoutID)
            clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            root.resize();
        }, waitTime);
    };
    window.addEventListener("resize", onResize);
    return () => {
        window.removeEventListener("resize", onResize);
    };
};
exports.enableDebouncedResize = enableDebouncedResize;
/** Creates and positions a label on the X-axis. */
const createXAxisLabel = (axis, text) => {
    axis.children.push(amcharts5_1.Label.new(axis.root, {
        text,
        x: amcharts5_1.p50,
        centerX: amcharts5_1.p50,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
    }));
};
exports.createXAxisLabel = createXAxisLabel;
/** Creates and positions a label on the Y-axis. */
const createYAxisLabel = (axis, text) => {
    axis.children.unshift(amcharts5_1.Label.new(axis.root, {
        rotation: -90,
        text,
        y: amcharts5_1.p50,
        centerX: amcharts5_1.p50,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        paddingBottom: 5,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
    }));
};
exports.createYAxisLabel = createYAxisLabel;
