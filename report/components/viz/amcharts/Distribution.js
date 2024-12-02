"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHistogramWithBoxplot = void 0;
const amcharts5_1 = require("@amcharts/amcharts5");
const xy_1 = require("@amcharts/amcharts5/xy");
const createHistogramWithBoxplot = (root) => {
    // Chart where we will put the boxplot and the histogram
    const chart = xy_1.XYChart.new(root, {
        // stack vertically
        layout: root.verticalLayout,
        // allow zooming
        panX: true,
        wheelY: "zoomX",
    });
    // X-axis, shared by all series
    const xAxis = chart.xAxes.push(xy_1.ValueAxis.new(root, {
        renderer: xy_1.AxisRendererX.new(root, {}),
    }));
    const { quantileSeries, medianSeries } = createBoxplot(root, chart, xAxis);
    const histogramSeries = createHistogram(root, chart, xAxis);
    const setData = (data) => {
        // set boxplot data
        quantileSeries.chart?.yAxes.getIndex(0)?.data.setAll([data.boxplot]); // needed for the dummy category to work
        quantileSeries.data.setAll([data.boxplot]);
        medianSeries.data.setAll([data.boxplot]);
        // set histogram data
        const values = [];
        const step = (data.boxplot.whiskerMax - data.boxplot.whiskerMin) / data.count.length;
        let accum = data.boxplot.whiskerMin;
        for (let i = 0; i < data.count.length; i++) {
            values.push({
                value: data.count[i],
                from: accum,
                to: accum + step,
            });
            accum += step;
        }
        histogramSeries.data.setAll(values);
    };
    return {
        chart,
        setData,
        quantileSeries,
        medianSeries,
        histogramSeries,
        xAxis,
        yAxis: chart.yAxes.getIndex(1), // histogram Y-axis
    };
};
exports.createHistogramWithBoxplot = createHistogramWithBoxplot;
const createBoxplot = (root, chart, xAxis) => {
    // Y-axis for the boxplot (dummy, not used)
    const yAxis = chart.yAxes.push(xy_1.CategoryAxis.new(root, {
        categoryField: "q1",
        renderer: xy_1.AxisRendererY.new(root, {}),
        // top, from top to 20%
        y: 0,
        height: (0, amcharts5_1.percent)(20),
    }));
    // hide the dummy label
    yAxis.get("renderer").labels.template.set("visible", false);
    // Quantile series (whiskers and box)
    // Actually it is just a candlestick series with one dummy category in the Y-axis
    const quantileSeries = chart.series.push(xy_1.CandlestickSeries.new(root, {
        xAxis,
        yAxis,
        lowValueXField: "whiskerMin",
        openValueXField: "q1",
        valueXField: "q3",
        highValueXField: "whiskerMax",
        // dummy category, can be set to any field
        categoryYField: "q1",
    }));
    // change the color of the box and whiskers
    // (the color of the rising candlestick, since it is the first and only one)
    quantileSeries.columns.template.states.create("riseFromOpen", {
        fill: undefined,
        stroke: amcharts5_1.Color.fromHex(0xd0db2d),
    });
    // Median series
    // Needed to draw the median line
    const medianSeries = chart.series.push(xy_1.StepLineSeries.new(root, {
        stroke: amcharts5_1.Color.fromHex(0xd0db2d),
        xAxis,
        yAxis,
        valueXField: "median",
        noRisers: true,
        // dummy category, can be set to any field
        categoryYField: "q1",
    }));
    return { quantileSeries, medianSeries };
};
const createHistogram = (root, chart, xAxis) => {
    // Y-axis for the histogram
    const yAxis = chart.yAxes.push(xy_1.ValueAxis.new(root, {
        renderer: xy_1.AxisRendererY.new(root, {}),
        // bottom, from 20% to bottom
        y: (0, amcharts5_1.percent)(20),
        height: (0, amcharts5_1.percent)(80),
    }));
    // Histogram series
    const series = chart.series.push(xy_1.ColumnSeries.new(root, {
        xAxis,
        yAxis,
        valueXField: "from",
        openValueXField: "to",
        valueYField: "value",
        fill: amcharts5_1.Color.fromHex(0xd0db2d),
    }));
    series.columns.template.set("strokeOpacity", 0);
    return series;
};
