"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBarChart = void 0;
const xy_1 = require("@amcharts/amcharts5/xy");
const createBarChart = (root, xField, yField) => {
    const chart = xy_1.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
    });
    // we want to show the tooltip on hover but not show the dashed lines
    const cursor = chart.set("cursor", xy_1.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);
    const xAxis = chart.xAxes.push(xy_1.CategoryAxis.new(root, {
        renderer: xy_1.AxisRendererX.new(root, { minGridDistance: 30 }),
        categoryField: xField,
    }));
    const yAxis = chart.yAxes.push(xy_1.ValueAxis.new(root, {
        renderer: xy_1.AxisRendererY.new(root, {}),
    }));
    const series = chart.series.push(xy_1.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: xField,
        valueYField: yField,
    }));
    return {
        chart,
        series,
        xAxis,
        yAxis,
    };
};
exports.createBarChart = createBarChart;
