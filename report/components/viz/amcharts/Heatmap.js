"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeatmap = void 0;
const amcharts5_1 = require("@amcharts/amcharts5");
const xy_1 = require("@amcharts/amcharts5/xy");
const createHeatmap = (root, xField, yField, valueField, startColor, endColor) => {
    const chart = xy_1.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
    });
    const xAxis = chart.xAxes.push(xy_1.CategoryAxis.new(root, {
        renderer: xy_1.AxisRendererX.new(root, {}),
        categoryField: xField,
    }));
    const yAxis = chart.yAxes.push(xy_1.CategoryAxis.new(root, {
        renderer: xy_1.AxisRendererY.new(root, {}),
        categoryField: yField,
    }));
    const series = chart.series.push(xy_1.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        categoryXField: xField,
        categoryYField: yField,
        valueField: valueField,
        calculateAggregates: true,
    }));
    series.set("heatRules", [
        {
            target: series.columns.template,
            min: startColor,
            max: endColor,
            dataField: valueField,
            key: "fill",
        },
    ]);
    // add color legend
    const heatLegend = chart.bottomAxesContainer.children.push(amcharts5_1.HeatLegend.new(root, {
        orientation: "horizontal",
        startColor,
        endColor,
    }));
    series.columns.template.events.on("pointerover", (event) => {
        const di = event.target.dataItem;
        if (di) {
            // @ts-expect-error
            heatLegend.showValue(di.get("value", 0));
        }
    });
    series.events.on("datavalidated", () => {
        heatLegend.set("startValue", series.getPrivate("valueLow"));
        heatLegend.set("endValue", series.getPrivate("valueHigh"));
    });
    return {
        chart,
        series,
        xAxis,
        yAxis,
    };
};
exports.createHeatmap = createHeatmap;
