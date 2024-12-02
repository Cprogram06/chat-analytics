"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesOverTime = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const amcharts5_1 = require("@amcharts/amcharts5");
const xy_1 = require("@amcharts/amcharts5/xy");
const BlockHook_1 = require("@report/BlockHook");
const AmCharts5_1 = require("@report/components/viz/amcharts/AmCharts5");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const MessagesOverTime = ({ options }) => {
    const data = (0, BlockHook_1.useBlockData)("messages/per-period");
    const createMessagesChart = (0, react_1.useCallback)((c) => {
        const period = ["day", "week", "month"][options[0]];
        const chart = c.children.push(xy_1.XYChart.new(c.root, {
            layout: c.root.verticalLayout,
        }));
        const cursor = chart.set("cursor", xy_1.XYCursor.new(c.root, {}));
        cursor.lineX.set("visible", false);
        cursor.lineY.set("visible", false);
        const xAxis = chart.xAxes.push(xy_1.DateAxis.new(c.root, {
            baseInterval: { timeUnit: period, count: 1 },
            renderer: xy_1.AxisRendererX.new(c.root, {}),
        }));
        const yAxis = chart.yAxes.push(xy_1.ValueAxis.new(c.root, {
            renderer: xy_1.AxisRendererY.new(c.root, {}),
            maxPrecision: 0,
            min: 0, // always base at 0
        }));
        (0, AmCharts5_1.createYAxisLabel)(yAxis, "Messages sent");
        const tooltip = amcharts5_1.Tooltip.new(c.root, {
            labelText: {
                day: "[bold]{valueX.formatDate('dd MMMM yyyy')}[/]: {valueY} messages sent",
                week: "[bold]A week of {valueX.formatDate('MMMM yyyy')}[/]: {valueY} messages sent",
                month: "[bold]{valueX.formatDate('MMMM yyyy')}[/]: {valueY} messages sent",
            }[period],
        });
        const graphType = period === "day" ? "step" : "column";
        let series;
        // for days
        if (graphType === "step") {
            series = xy_1.StepLineSeries.new(c.root, {
                valueXField: "ts",
                valueYField: "v",
                xAxis: xAxis,
                yAxis: yAxis,
                noRisers: true,
                stroke: amcharts5_1.Color.fromHex(0x008cff),
                fill: amcharts5_1.Color.fromHex(0x008cff),
                tooltip,
            });
            series.strokes.template.setAll({
                visible: true,
                strokeWidth: 3,
                strokeOpacity: 1,
            });
            series.fills.template.setAll({
                visible: true,
                fillOpacity: 0.3,
            });
        }
        else {
            // for weeks and months
            series = xy_1.ColumnSeries.new(c.root, {
                valueXField: "ts",
                valueYField: "v",
                xAxis: xAxis,
                yAxis: yAxis,
                fill: amcharts5_1.Color.fromHex(0x008cff),
                tooltip,
            });
            // rounded corners
            series.columns.template.setAll({
                cornerRadiusTL: 3,
                cornerRadiusTR: 3,
                strokeOpacity: 0,
            });
        }
        chart.series.push(series);
        const setData = (data) => {
            series.data.setAll({
                day: data.perDay,
                week: data.perWeek,
                month: data.perMonth,
            }[period]);
        };
        const cleanupAxisSync = (0, AmCharts5_1.syncAxisWithTimeFilter)([series], xAxis, yAxis);
        return [setData, cleanupAxisSync];
    }, [options[0]]);
    return ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { data: data, create: createMessagesChart, style: {
            minHeight: 550,
            marginLeft: 5,
            marginBottom: 8,
        } }));
};
exports.MessagesOverTime = MessagesOverTime;
