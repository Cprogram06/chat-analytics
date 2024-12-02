"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekdayHourActivity = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const amcharts5_1 = require("@amcharts/amcharts5");
const BlockHook_1 = require("@report/BlockHook");
const AmCharts5_1 = require("@report/components/viz/amcharts/AmCharts5");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const BarChart_1 = require("@report/components/viz/amcharts/BarChart");
const Heatmap_1 = require("@report/components/viz/amcharts/Heatmap");
const HOURS = [...Array(24).keys()]; // [0, 1, 2, ..., 22, 23]
const MIN_COLOR = amcharts5_1.Color.fromHex(0xfefa76);
const MAX_COLOR = amcharts5_1.Color.fromHex(0xfe3527);
const createActivitySplit = (c) => {
    const { series: weekdaySeries, xAxis: weekdayXAxis } = (0, BarChart_1.createBarChart)(c.root, "weekday", "value");
    const { series: hourSeries, xAxis: hourXAxis } = (0, BarChart_1.createBarChart)(c.root, "hour", "value");
    // set height to 50%
    weekdaySeries.chart.set("height", (0, amcharts5_1.percent)(50));
    [weekdaySeries, hourSeries].forEach((s, i) => {
        // rounded corners
        s.columns.template.setAll({
            cornerRadiusTL: 5,
            cornerRadiusTR: 5,
            strokeOpacity: 0,
        });
        // heatmap colors
        s.set("heatRules", [
            {
                target: s.columns.template,
                min: MIN_COLOR,
                max: MAX_COLOR,
                dataField: "valueY",
                key: "fill",
            },
        ]);
        // tooltip
        s.setAll({
            calculateAggregates: true,
            tooltip: amcharts5_1.Tooltip.new(c.root, {
                labelText: `[bold]{categoryX}${i == 0 ? "" : "hs"}[/]: {valueY} messages sent`,
            }),
        });
        s.chart.xAxes.getIndex(0).get("renderer").setAll({
            minGridDistance: 20, // make sure all labels are visible
        });
        (0, AmCharts5_1.createYAxisLabel)(s.chart.yAxes.getIndex(0), "Messages sent");
    });
    c.children.push(weekdaySeries.chart);
    c.children.push(hourSeries.chart);
    return (data) => {
        const aggrWeekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((weekday) => ({
            weekday,
            value: data.filter(({ weekday: w }) => w === weekday).reduce((acc, { value }) => acc + value, 0),
        }));
        const aggrHours = HOURS.map((h) => ({
            hour: h,
            value: data.filter(({ hour: hh }) => hh === `${h}hs`).reduce((acc, { value }) => acc + value, 0),
        }));
        weekdaySeries.data.setAll(aggrWeekdays.filter((x) => x.value > 0));
        weekdayXAxis.data.setAll(aggrWeekdays);
        hourSeries.data.setAll(aggrHours.filter((x) => x.value > 0));
        hourXAxis.data.setAll(aggrHours);
    };
};
const createActivityHeatmap = (c) => {
    const { chart, series, xAxis, yAxis } = (0, Heatmap_1.createHeatmap)(c.root, "weekday", "hour", "value", MIN_COLOR, MAX_COLOR);
    xAxis.get("renderer").setAll({
        minGridDistance: 20,
        opposite: true, // weekdays at the top (labels)
    });
    xAxis.data.setAll([
        { weekday: "Mon" },
        { weekday: "Tue" },
        { weekday: "Wed" },
        { weekday: "Thu" },
        { weekday: "Fri" },
        { weekday: "Sat" },
        { weekday: "Sun" },
    ]);
    yAxis.get("renderer").setAll({
        minGridDistance: 20,
        inversed: true, // from 0hs to 23hs
    });
    yAxis.data.setAll(HOURS.map((h) => ({
        hour: `${h}hs`,
    })));
    series.columns.template.setAll({
        tooltipText: "[bold]{categoryX} at {categoryY}[/]: {value} messages sent",
        stroke: amcharts5_1.Color.fromHex(0xffffff),
        strokeOpacity: 1,
        strokeWidth: 1,
        width: amcharts5_1.p100,
        height: amcharts5_1.p100,
    });
    c.children.push(chart);
    return (data) => series.data.setAll(data.filter((x) => x.value > 0));
};
const WeekdayHourActivity = ({ options }) => ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { style: {
        minHeight: 617,
        marginLeft: 5,
        marginBottom: 8,
    }, data: (0, BlockHook_1.useBlockData)("messages/stats")?.weekdayHourActivity, create: options[0] === 0 ? createActivitySplit : createActivityHeatmap }));
exports.WeekdayHourActivity = WeekdayHourActivity;
