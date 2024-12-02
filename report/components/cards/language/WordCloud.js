"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const amcharts5_1 = require("@amcharts/amcharts5");
const wc_1 = require("@amcharts/amcharts5/wc");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const createWordCloud = (c) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const series = c.root.container.children.push(wc_1.WordCloud.new(c.root, {
        minFontSize: 10,
        maxFontSize: 80,
        randomness: 0.7,
        colors: amcharts5_1.ColorSet.new(c.root, {}),
        paddingBottom: 10,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
    }));
    return (words) => {
        const data = words
            .map((c, i) => ({
            category: db.words[i],
            value: c,
        }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 100);
        series.data.setAll(data);
    };
};
const WordCloud = (props) => ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { create: createWordCloud, data: props.wordsCount, style: {
        minHeight: 673,
        marginLeft: 5,
        marginBottom: 8,
    } }));
exports.default = WordCloud;
