"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const amcharts5_1 = require("@amcharts/amcharts5");
const hierarchy_1 = require("@amcharts/amcharts5/hierarchy");
const BlockHook_1 = require("@report/BlockHook");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const createTreeTheme = (root) => {
    const treeTheme = amcharts5_1.Theme.new(root);
    for (let depth = 0; depth < 10; depth++) {
        treeTheme.rule("RoundedRectangle", ["hierarchy", "node", "shape", "depth" + depth]).setAll({
            strokeWidth: 2,
            stroke: amcharts5_1.Color.fromHex(0x232930),
        });
    }
    return treeTheme;
};
const createTreeChart = (c) => {
    let series = c.children.push(hierarchy_1.Treemap.new(c.root, {
        sort: "descending",
        singleBranchOnly: true,
        topDepth: 0,
        initialDepth: 1,
        valueField: "count",
        categoryField: "domain",
        childDataField: "subdomains",
        nodePaddingOuter: 0,
        nodePaddingInner: 0,
        nodePaddingTop: 0,
        nodePaddingBottom: 0,
    }));
    //series.get("colors")!.set("step", 1);
    const nav = c.children.unshift(hierarchy_1.BreadcrumbBar.new(c.root, {
        series: series,
    }));
    nav.labels.template.setAll({
        fontSize: 20,
        fill: amcharts5_1.Color.fromHex(0x7ed0ff),
    });
    series.events.on("dataitemselected", ({ dataItem }) => {
        dataItem?._settings.children.forEach((c) => {
            let domain = c.dataContext.domain;
            // skip "Other" nodes
            if (domain.includes("Other"))
                return undefined;
            // if TLD, try to load icon from nic site (nic.us, nic.io, etc.)
            if (domain.startsWith(".") && domain.split(".").length === 2)
                domain = "nic" + domain;
            // remove front dot
            if (domain.startsWith("."))
                domain = domain.substr(1);
            const imageSrc = "https://icons.duckduckgo.com/ip3/" + domain + ".ico";
            c.bullets[0].get("sprite").set("src", imageSrc);
        });
    });
    series.bullets.push(function (root, series, dataItem) {
        const picture = amcharts5_1.Picture.new(root, {
            centerX: amcharts5_1.p50,
            centerY: amcharts5_1.p50,
            width: 32,
            height: 32,
            isMeasured: true,
            dy: -28,
            // we don't have Access-Control-Allow-Origin in icons.duckduckgo.com
            // so request using no-cors mode (Opaque Response)
            cors: null,
        });
        return amcharts5_1.Bullet.new(root, { sprite: picture });
    });
    return (data) => {
        series.data.setAll([data]);
        series.set("selectedDataItem", series.dataItems[0]);
    };
};
const DomainsTree = () => ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart
/* TreeMap appears to be broken if animations are disabled, wtf? */
, { 
    /* TreeMap appears to be broken if animations are disabled, wtf? */
    animated: true, create: createTreeChart, createTheme: createTreeTheme, data: (0, BlockHook_1.useBlockData)("domains/stats")?.tree, style: {
        minHeight: 681,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    } }));
exports.default = DomainsTree;
