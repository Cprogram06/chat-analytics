"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordLabel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const BaseLabel_1 = require("@report/components/core/labels/BaseLabel");
const _WordLabel = ({ index }) => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const word = db.words[index];
    return (0, jsx_runtime_1.jsx)(BaseLabel_1.BaseLabel, { title: word, name: word });
};
exports.WordLabel = (0, react_1.memo)(_WordLabel);
