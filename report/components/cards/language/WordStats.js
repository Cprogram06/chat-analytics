"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const amcharts5_1 = require("@amcharts/amcharts5");
const xy_1 = require("@amcharts/amcharts5/xy");
const BlockHook_1 = require("@report/BlockHook");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const AuthorLabel_1 = require("@report/components/core/labels/AuthorLabel");
const ChannelLabel_1 = require("@report/components/core/labels/ChannelLabel");
const AnimatedBars_1 = __importDefault(require("@report/components/viz/AnimatedBars"));
const AmCharts5_1 = require("@report/components/viz/amcharts/AmCharts5");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const createChart = (c) => {
    const chart = c.children.push(xy_1.XYChart.new(c.root, {
        layout: c.root.verticalLayout,
    }));
    chart.children.unshift(amcharts5_1.Label.new(c.root, {
        text: "Usage over time",
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
        x: amcharts5_1.p50,
        centerX: amcharts5_1.p50,
        paddingTop: 0,
        paddingBottom: 10,
    }));
    const cursor = chart.set("cursor", xy_1.XYCursor.new(c.root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);
    const xAxis = chart.xAxes.push(xy_1.DateAxis.new(c.root, {
        baseInterval: { timeUnit: "month", count: 1 },
        renderer: xy_1.AxisRendererX.new(c.root, {}),
    }));
    const yAxis = chart.yAxes.push(xy_1.ValueAxis.new(c.root, {
        renderer: xy_1.AxisRendererY.new(c.root, {}),
        maxPrecision: 0,
        min: 0, // always base at 0
    }));
    (0, AmCharts5_1.createYAxisLabel)(yAxis, "Number of times written");
    const tooltip = amcharts5_1.Tooltip.new(c.root, {
        labelText: "[bold]{valueX.formatDate('MMMM yyyy')}[/]: {valueY} times written",
    });
    let series;
    series = xy_1.ColumnSeries.new(c.root, {
        valueXField: "ts",
        valueYField: "v",
        xAxis: xAxis,
        yAxis: yAxis,
        fill: amcharts5_1.Color.fromHex(0x00ffc5),
        tooltip,
    });
    // rounded corners
    series.columns.template.setAll({
        cornerRadiusTL: 3,
        cornerRadiusTR: 3,
        strokeOpacity: 0,
    });
    chart.series.push(series);
    const setData = (data) => {
        series.data.setAll(data);
    };
    const cleanupAxisSync = (0, AmCharts5_1.syncAxisWithTimeFilter)([series], xAxis, yAxis);
    return [setData, cleanupAxisSync];
};
const WordStats = ({ wordIndex }) => {
    const word = wordIndex >= 0 ? (0, WorkerWrapper_1.getDatabase)().words[wordIndex] : "";
    const wordStats = (0, BlockHook_1.useBlockData)("language/word-stats", { wordIndex });
    const maxItems = 4;
    const computed = (0, react_1.useMemo)(() => {
        if (wordStats === undefined) {
            return {
                authorEntries: [],
                channelEntries: [],
            };
        }
        return {
            authorEntries: wordStats.counts.authors
                .map((value, index) => ({
                index,
                value,
            }))
                .filter((a) => a.value > 0) // filter out 0
                .sort((a, b) => b.value - a.value)
                .slice(0, maxItems),
            channelEntries: wordStats.counts.channels
                .map((value, index) => ({
                index,
                value,
            }))
                .filter((a) => a.value > 0) // filter out 0
                .sort((a, b) => b.value - a.value)
                .slice(0, maxItems),
        };
    }, [wordStats]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h1", { className: "word-title", children: word }), (0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { create: createChart, data: wordStats?.perMonth, style: {
                    minHeight: 250,
                    marginLeft: 5,
                    marginBottom: 8,
                } }), (0, jsx_runtime_1.jsx)(AnimatedBars_1.default, { what: "Author", unit: "# of times written", data: computed.authorEntries, itemComponent: AuthorLabel_1.AuthorLabel, maxItems: maxItems, colorHue: 240 }), (0, jsx_runtime_1.jsx)(AnimatedBars_1.default, { what: "Channel", unit: "# of times written", data: computed.channelEntries, itemComponent: ChannelLabel_1.ChannelLabel, maxItems: maxItems, colorHue: 266 })] }));
};
exports.default = WordStats;
