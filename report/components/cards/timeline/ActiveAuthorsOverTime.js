"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const BlockHook_1 = require("@report/BlockHook");
const AmCharts5_1 = require("@report/components/viz/amcharts/AmCharts5");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const Timeline_1 = require("@report/components/viz/amcharts/Timeline");
const createChart = (c) => {
    const { yAxis, setData, cleanup } = (0, Timeline_1.createTimeline)(c, "month", "smoothed");
    (0, AmCharts5_1.createYAxisLabel)(yAxis, "Active authors during month");
    return [setData, cleanup];
};
const ActiveAuthorsOverTime = () => ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { create: createChart, data: (0, BlockHook_1.useBlockData)("timeline/active-authors")?.perSeriesPerMonth, style: {
        minHeight: 500,
        marginLeft: 5,
        marginBottom: 8,
    } }));
exports.default = ActiveAuthorsOverTime;
