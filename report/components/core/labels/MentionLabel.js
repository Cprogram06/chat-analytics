"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const BaseLabel_1 = require("@report/components/core/labels/BaseLabel");
const _MentionLabel = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const mention = db.mentions[index];
    const name = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { style: { color: "#eded3d" }, children: "@" }), mention] }));
    return (0, jsx_runtime_1.jsx)(BaseLabel_1.BaseLabel, { title: mention, name: name });
};
exports.MentionLabel = (0, react_1.memo)(_MentionLabel);
