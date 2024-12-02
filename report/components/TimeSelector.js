"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const amcharts5_1 = require("@amcharts/amcharts5");
const xy_1 = require("@amcharts/amcharts5/xy");
const BlockHook_1 = require("@report/BlockHook");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const LoadingGroup_1 = require("@report/components/LoadingGroup");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const SB_HEIGHT = 50;
const RESETS = {
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
};
const createTimeSelector = (c) => {
    const chart = c.root.container.children.push(xy_1.XYChart.new(c.root, {
        layout: c.root.verticalLayout,
        ...RESETS,
    }));
    const scrollbarX = xy_1.XYChartScrollbar.new(c.root, {
        orientation: "horizontal",
        height: SB_HEIGHT,
        ...RESETS,
    });
    scrollbarX.get("background").setAll({
        fill: amcharts5_1.Color.fromHex(0x1e2529),
        fillOpacity: 0.01,
    });
    chart.plotContainer.set("visible", false);
    chart.rightAxesContainer.set("visible", false);
    chart.leftAxesContainer.set("visible", false);
    chart.bottomAxesContainer.set("visible", false);
    chart.set("scrollbarX", scrollbarX);
    const xAxis = scrollbarX.chart.xAxes.push(xy_1.DateAxis.new(c.root, {
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: xy_1.AxisRendererX.new(c.root, {}),
    }));
    const yAxis = scrollbarX.chart.yAxes.push(xy_1.ValueAxis.new(c.root, {
        renderer: xy_1.AxisRendererY.new(c.root, {}),
        min: 0,
        maxPrecision: 0,
    }));
    const series = scrollbarX.chart.series.push(xy_1.StepLineSeries.new(c.root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "ts",
        valueYField: "v",
        noRisers: true,
    }));
    series.strokes.template.setAll({
        strokeWidth: 2,
        strokeOpacity: 0.5,
    });
    series.fills.template.setAll({
        fillOpacity: 0.2,
        visible: true,
    });
    const dateAxisChanged = (ev) => {
        let start = xAxis.positionToDate(ev.start);
        let end = xAxis.positionToDate(ev.end);
        if (start > end)
            [start, end] = [end, start];
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            (0, WorkerWrapper_1.getWorker)().updateTimeRange(start, end);
        }
    };
    scrollbarX.events.on("rangechanged", dateAxisChanged);
    return (data) => {
        series.data.setAll(data);
    };
};
const TimeSelector = () => ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { create: createTimeSelector, data: (0, BlockHook_1.useBlockData)("messages/per-period")?.perDay, className: "TimeSelector", style: {
        height: SB_HEIGHT + 1,
    } }));
exports.default = () => (0, jsx_runtime_1.jsx)(LoadingGroup_1.LoadingGroup, { children: () => (0, jsx_runtime_1.jsx)(TimeSelector, {}) });
