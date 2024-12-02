"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const amcharts5_1 = require("@amcharts/amcharts5");
const percent_1 = require("@amcharts/amcharts5/percent");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const createPieChart = (c) => {
    const chart = c.root.container.children.push(percent_1.PieChart.new(c.root, {
        layout: c.root.verticalLayout,
    }));
    const series = chart.series.push(percent_1.PieSeries.new(c.root, {
        valueField: "count",
        categoryField: "tag",
        alignLabels: false,
        innerRadius: new amcharts5_1.Percent(50),
        tooltip: amcharts5_1.Tooltip.new(c.root, {
            forceHidden: true,
        }),
    }));
    series.slices.template.setAll({
        // disable pull-out
        toggleKey: "none",
    });
    series.labels.template.setAll({
        textType: "circular",
        centerX: 0,
        centerY: 0,
    });
    series
        .get("colors")
        .set("colors", [
        c.root.interfaceColors.get("positive"),
        c.root.interfaceColors.get("negative"),
        amcharts5_1.Color.fromHex(0x00bcd4),
    ]);
    return (data) => {
        series.data.setAll([
            {
                tag: "Positive",
                count: data.p,
            },
            {
                tag: "Negative",
                count: data.n,
            },
            {
                tag: "Neutral",
                count: data.z,
            },
        ]);
    };
};
const SentimentPieChart = (props) => {
    return ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { create: createPieChart, data: props, style: {
            minHeight: 477,
            marginLeft: 5,
            marginBottom: 8,
        } }));
};
exports.default = SentimentPieChart;
