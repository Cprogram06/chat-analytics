"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
require("@assets/styles/Footer.less");
const extraInfo = () => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Report generated at: ", (0, jsx_runtime_1.jsx)("b", { children: (0, WorkerWrapper_1.getDatabase)().generatedAt }), (0, jsx_runtime_1.jsx)("br", {}), "Build date: ", (0, jsx_runtime_1.jsx)("b", { children: env.build.date }), (0, jsx_runtime_1.jsx)("br", {}), "Build version: ", (0, jsx_runtime_1.jsxs)("b", { children: ["v", env.build.version] })] }));
exports.default = () => (0, jsx_runtime_1.jsx)("div", { className: "Footer" });
