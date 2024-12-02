"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("react-dom/client");
const BlockStore_1 = require("@report/BlockStore");
const ReportPage_1 = __importDefault(require("@report/ReportPage"));
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const Plausible_1 = require("@assets/Plausible");
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const dataElem = document.getElementById("data");
        let dataStr = dataElem.textContent || "";
        dataElem.remove();
        if (dataStr === "[[[DATA]]]") {
            // load from public/ folder
            const res = await fetch("report_sample.data");
            if (res.status !== 200) {
                alert("Could not load `report_sample.data` from `/public` for development, make sure to generate one.");
                return;
            }
            dataStr = await res.text();
        }
        if (dataStr.length === 0 || dataStr === "[[[DATA]]]") {
            alert("Missing report data");
            if (env.isProd)
                window.location.href = "/";
            return;
        }
        (0, WorkerWrapper_1.initWorker)(dataStr);
        (0, BlockStore_1.initBlockStore)();
    }
    catch (err) {
        // set basic error message
        document.querySelector(".basic").textContent = "Error occurred: " + err.message;
        return;
    }
    (0, client_1.createRoot)(document.getElementById("app")).render((0, jsx_runtime_1.jsx)(react_1.StrictMode, { children: (0, jsx_runtime_1.jsx)(ReportPage_1.default, {}) }));
});
console.log(env);
(0, Plausible_1.plausible)("pageview");
