"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const flow_1 = require("@amcharts/amcharts5/flow");
const BlockHook_1 = require("@report/BlockHook");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const AmCharts5Chart_1 = require("@report/components/viz/amcharts/AmCharts5Chart");
const createParticipationChart = (c) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const series = c.root.container.children.push(flow_1.ChordDirected.new(c.root, {
        sourceIdField: "f",
        targetIdField: "t",
        valueField: "c",
    }));
    series.nodes.setAll({
        idField: "id",
        nameField: "name",
    });
    series.nodes.labels.template.setAll({
        textType: "adjusted",
    });
    series.links.template.setAll({
        tooltipText: "Conversation that both [bold]{sourceId}[/] and [bold]{targetId}[/] participated: [bold]{value}[/]",
    });
    return (data) => {
        series.nodes.data.clear();
        series.data.clear();
        series.data.setAll(data.nodes.map((node) => ({
            f: db.authors[node.f].n,
            t: db.authors[node.t].n,
            c: node.c,
        })));
    };
};
const ConversationParticipation = () => {
    const data = (0, BlockHook_1.useBlockData)("interaction/conversation-stats");
    return ((0, jsx_runtime_1.jsx)(AmCharts5Chart_1.AmCharts5Chart, { data: data, create: createParticipationChart, style: {
            minHeight: 619,
            marginLeft: 5,
            marginBottom: 8,
        } }));
};
exports.default = ConversationParticipation;
