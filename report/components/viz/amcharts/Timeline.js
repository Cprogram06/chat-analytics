"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeline = void 0;
const amcharts5_1 = require("@amcharts/amcharts5");
const xy_1 = require("@amcharts/amcharts5/xy");
const Series_1 = require("@pipeline/aggregate/blocks/timeline/Series");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const AmCharts5_1 = require("@report/components/viz/amcharts/AmCharts5");
const createTimeline = (c, timeUnit, seriesChart) => {
    const { root } = c;
    const db = (0, WorkerWrapper_1.getDatabase)();
    const cursor = xy_1.XYCursor.new(root, {
        behavior: "none",
    });
    cursor.lineY.set("visible", false);
    const chart = root.container.children.push(xy_1.XYChart.new(root, {
        layout: root.verticalLayout,
        cursor,
    }));
    chart.setAll({
        paddingRight: 0,
        marginRight: 0,
    });
    chart.get("colors").set("step", 3);
    const xAxis = chart.xAxes.push(xy_1.DateAxis.new(root, {
        baseInterval: { timeUnit, count: 1 },
        renderer: xy_1.AxisRendererX.new(root, {}),
        tooltip: amcharts5_1.Tooltip.new(root, {}),
    }));
    const yAxis = chart.yAxes.push(xy_1.ValueAxis.new(root, {
        renderer: xy_1.AxisRendererY.new(root, {}),
        maxPrecision: 0,
        min: 0, // always bottom fixed at 0
    }));
    const createSeries = (def) => {
        let series;
        const settings = {
            name: def.title,
            valueXField: "ts",
            valueYField: "v",
            xAxis: xAxis,
            yAxis: yAxis,
            legendLabelText: "[{stroke}]{name}[/][bold #888]{categoryX}[/]",
            legendRangeLabelText: "[{stroke}]{name}[/]",
            legendValueText: "{valueY}",
            legendRangeValueText: "[bold #888]-[/]",
            minBulletDistance: 8, // hide bullets if they are too close
        };
        if (seriesChart === "step") {
            series = xy_1.StepLineSeries.new(root, settings);
            series.strokes.template.setAll({
                visible: true,
                strokeWidth: 2,
                strokeOpacity: 0.8,
            });
        }
        else {
            // seriesChart === "smoothed"
            series = xy_1.SmoothedXLineSeries.new(root, settings);
            series.bullets.push(() => amcharts5_1.Bullet.new(root, {
                locationY: 0,
                sprite: amcharts5_1.Circle.new(root, {
                    radius: 4,
                    stroke: series.get("fill"),
                    strokeWidth: 2,
                    fill: amcharts5_1.Color.brighten(series.get("fill"), -0.3),
                }),
            }));
        }
        series.fills.template.setAll({
            visible: true,
            fillOpacity: 0.1,
            templateField: "lineSettings",
        });
        series.strokes.template.setAll({
            templateField: "lineSettings",
        });
        chart.series.push(series);
        return series;
    };
    const series = (0, Series_1.generateSeries)(db).map(createSeries);
    const legend = chart.children.unshift(amcharts5_1.Legend.new(root, {
        centerX: amcharts5_1.p50,
        x: amcharts5_1.p50,
        marginTop: -20,
        marginBottom: 10,
    }));
    legend.data.setAll(series);
    const setData = (data) => {
        for (let i = 0; i < data.length; i++) {
            const items = data[i];
            if (items.length > 0)
                series[i].show();
            else
                series[i].hide();
            if (items.length > 1) {
                // @ts-expect-error
                items[items.length - 2].lineSettings = {
                    strokeDasharray: [3, 3],
                    fillOpacity: 0.05,
                };
            }
            series[i].data.setAll(items);
        }
    };
    const cleanupAxisSync = (0, AmCharts5_1.syncAxisWithTimeFilter)(series, xAxis, yAxis);
    return {
        yAxis,
        setData,
        cleanup: cleanupAxisSync,
    };
};
exports.createTimeline = createTimeline;
