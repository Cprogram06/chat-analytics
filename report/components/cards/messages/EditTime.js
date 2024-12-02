"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const amcharts5_1 = require("@amcharts/amcharts5");
const xy_1 = require("@amcharts/amcharts5/xy");
const BlockHook_1 = require("@report/BlockHook");
const DottedTable_1 = __importDefault(require("@report/components/viz/DottedTable"));
const AmCharts5_1 = require("@report/components/viz/amcharts/AmCharts5");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const Distribution_1 = require("@report/components/viz/amcharts/Distribution");
const createChart = (c) => {
    const { chart, setData, histogramSeries, xAxis, yAxis } = (0, Distribution_1.createHistogramWithBoxplot)(c.root);
    histogramSeries.setAll({
        tooltip: amcharts5_1.Tooltip.new(c.root, {
            labelText: "[bold]{valueY} messages [/] were edited\n between [bold]{from}-{to} seconds[/] after being sent",
        }),
    });
    xAxis.setAll({
        min: 0,
        maxPrecision: 0,
        numberFormat: "#.#",
        extraTooltipPrecision: 1,
    });
    yAxis.setAll({
        tooltipText: "{value} messages sent",
        min: 0,
        maxPrecision: 0, // integer
    });
    (0, AmCharts5_1.createXAxisLabel)(xAxis, "Seconds between sending and editing");
    (0, AmCharts5_1.createYAxisLabel)(yAxis, "Messages edited");
    const cursor = chart.set("cursor", xy_1.XYCursor.new(c.root, {}));
    cursor.lineY.set("visible", false);
    c.children.push(chart);
    return setData;
};
const EditTime = () => {
    const data = (0, BlockHook_1.useBlockData)("messages/edited");
    const lines = [
        {
            type: "separator",
        },
        {
            type: "number",
            formatter: "time",
            label: "Median time for editing a message",
            value: data?.editTimeDistribution.boxplot.median,
        },
        {
            type: "number",
            formatter: "time",
            label: "Three out of four messages were edited within",
            value: data?.editTimeDistribution.boxplot.q3,
        },
        {
            type: "number",
            formatter: "time",
            label: "Highest edit time difference",
            value: data?.editTimeDistribution.boxplot.max,
        },
        {
            type: "number",
            formatter: "integer",
            label: "Number of messages edited in less than a second",
            value: data?.editedInLessThan1Second,
        },
        {
            type: "separator",
        },
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { create: createChart, data: data?.editTimeDistribution, style: {
                    minHeight: 250,
                    marginLeft: 5,
                    marginBottom: 8,
                } }), (0, jsx_runtime_1.jsx)(DottedTable_1.default, { lines: lines })] }));
};
exports.default = EditTime;
