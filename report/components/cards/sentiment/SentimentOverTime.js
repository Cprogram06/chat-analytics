"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const amcharts5_1 = require("@amcharts/amcharts5");
const xy_1 = require("@amcharts/amcharts5/xy");
const BlockHook_1 = require("@report/BlockHook");
const AmCharts5_1 = require("@report/components/viz/amcharts/AmCharts5");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const SentimentOverTime = ({ options }) => {
    const createSentimentChart = (0, react_1.useCallback)((c) => {
        const chart = c.root.container.children.push(xy_1.XYChart.new(c.root, {
            layout: c.root.verticalLayout,
        }));
        const cursor = chart.set("cursor", xy_1.XYCursor.new(c.root, {}));
        cursor.lineX.set("visible", false);
        cursor.lineY.set("visible", false);
        const xAxis = chart.xAxes.push(xy_1.DateAxis.new(c.root, {
            baseInterval: { timeUnit: options[0] === 0 ? "week" : "month", count: 1 },
            renderer: xy_1.AxisRendererX.new(c.root, {}),
            tooltip: amcharts5_1.Tooltip.new(c.root, {}),
        }));
        const yAxis = chart.yAxes.push(xy_1.ValueAxis.new(c.root, {
            renderer: xy_1.AxisRendererY.new(c.root, {}),
        }));
        yAxis.setAll(options[1] === 0
            ? {
                min: -100,
                max: 100,
                numberFormat: "#s'%'",
            }
            : {
                min: undefined,
                max: undefined,
                numberFormat: "#s",
            });
        const series = [];
        function createSeries(field, color) {
            series.push(chart.series.push(xy_1.ColumnSeries.new(c.root, {
                xAxis: xAxis,
                yAxis: yAxis,
                valueXField: "t",
                valueYField: field,
                fill: color,
                stacked: true,
                tooltip: amcharts5_1.Tooltip.new(c.root, {}),
            })));
        }
        createSeries("p", c.root.interfaceColors.get("positive")); // positive messages
        createSeries("n", c.root.interfaceColors.get("negative")); // negative messages
        if (options[1] === 0) {
            series[0].set("valueYField", "percP");
            series[1].set("valueYField", "percN");
            series[0].get("tooltip").set("labelText", "{valueY}% positive messages sent");
            series[1].get("tooltip").set("labelText", "{valueY}% negative messages sent");
            (0, AmCharts5_1.createYAxisLabel)(yAxis, "Percentage of messages in period");
        }
        else if (options[1] === 1) {
            series[0].set("valueYField", "p");
            series[1].set("valueYField", "n");
            series[0].get("tooltip").set("labelText", "{valueY} positive messages sent");
            series[1].get("tooltip").set("labelText", "{valueY} negative messages sent");
            (0, AmCharts5_1.createYAxisLabel)(yAxis, "Number of messages");
        }
        else if (options[1] === 2) {
            series[0].set("valueYField", "diffP");
            series[1].set("valueYField", "diffN");
            series[0].get("tooltip").set("labelText", "{valueY} more positive messages than negative sent");
            series[1].get("tooltip").set("labelText", "{valueY} more negative messages than positive sent");
            (0, AmCharts5_1.createYAxisLabel)(yAxis, "Message difference (in number of messages)");
        }
        const cleanupAxisSync = (0, AmCharts5_1.syncAxisWithTimeFilter)(series, xAxis, yAxis);
        const setData = (data) => {
            series.forEach((s) => s.data.setAll([data.perWeek, data.perMonth][options[0]]));
        };
        return [setData, cleanupAxisSync];
    }, [options[0], options[1]]);
    return ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { create: createSentimentChart, data: (0, BlockHook_1.useBlockData)("sentiment/per-period"), style: {
            minHeight: 550,
            marginLeft: 5,
            marginBottom: 8,
        } }));
};
exports.default = SentimentOverTime;
