"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steps = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Button_1 = require("@app/components/Button");
const Stepper_1 = require("@app/components/Stepper");
const Platforms_1 = require("@pipeline/Platforms");
const Plausible_1 = require("@assets/Plausible");
require("@assets/styles/Steps.less");
const ExportInstructions_1 = require("./steps/ExportInstructions");
const FilesSelection_1 = require("./steps/FilesSelection");
const GenerationProgress_1 = require("./steps/GenerationProgress");
const PlatformSelection_1 = require("./steps/PlatformSelection");
const ViewDownloadReport_1 = require("./steps/ViewDownloadReport");
// prettier-ignore
const StepTitles = [
    "Select chat platform",
    "Export your chats",
    "Select exported files",
    "Generate report",
    "View/Download report"
];
const StepMaxHeights = [360, 1300, 400, 420, 420];
const BackColor = [216, 10, 10];
const NextColor = [258, 90, 61];
// we hardcode this task first since the worker doesn't emit it
const StartWorkerTask = {
    status: "success",
    title: "Start WebWorker",
};
// This component is a bit messy since it has all the logic to talk with the Worker
// It's not that bad
const Steps = () => {
    const [state, setState] = (0, react_1.useState)({
        currentStep: 0,
        platform: undefined,
        files: [],
        worker: null,
        result: null,
        progressTasks: [StartWorkerTask],
        progressStats: {},
    });
    const startGeneration = () => {
        (0, Plausible_1.plausible)("Start generation", {
            platform: state.platform,
            files: (0, Plausible_1.numberCategory)(state.files.length),
            size: (0, Plausible_1.sizeCategory)(state.files.reduce((acc, file) => acc + file.size, 0)),
        });
        const startTime = performance.now();
        // @ts-ignore
        const worker = new Worker(new URL("@app/WorkerApp.ts", import.meta.url));
        worker.onerror = (e) => {
            console.log(e);
            worker.terminate();
            setState((prevState) => {
                const tasks = prevState.progressTasks;
                const last = tasks[tasks.length - 1];
                last.status = "error";
                last.error = e.message;
                return {
                    ...prevState,
                    progressTasks: tasks,
                };
            });
            if (env.isDev)
                throw e;
        };
        worker.onmessage = (e) => {
            const data = e.data;
            const endTime = performance.now();
            let terminate = false;
            if (data.type === "progress") {
                if (data.tasks.some((task) => task.status === "error")) {
                    (0, Plausible_1.plausible)("Generation errored", {
                        platform: state.platform,
                        files: (0, Plausible_1.numberCategory)(state.files.length),
                        time: (0, Plausible_1.timeCategory)((endTime - startTime) / 1000),
                    });
                    terminate = true;
                }
                setState((state) => ({
                    ...state,
                    progressTasks: [StartWorkerTask, ...data.tasks],
                    progressStats: data.stats,
                }));
            }
            else if (data.type === "result") {
                (0, Plausible_1.plausible)("Finish generation", {
                    platform: state.platform,
                    outputSize: (0, Plausible_1.sizeCategory)(data.html.length),
                    messages: (0, Plausible_1.numberCategory)(data.counts.messages),
                    authors: (0, Plausible_1.numberCategory)(data.counts.authors),
                    channels: (0, Plausible_1.numberCategory)(data.counts.channels),
                    guilds: (0, Plausible_1.numberCategory)(data.counts.guilds),
                    time: (0, Plausible_1.timeCategory)((endTime - startTime) / 1000),
                    mainLang: data.lang,
                });
                // give a small delay
                setTimeout(() => {
                    setState((prevState) => ({
                        ...prevState,
                        currentStep: 4,
                        worker: null,
                        result: data,
                    }));
                }, 1000);
                // terminate worker since we don't need it anymore
                terminate = true;
            }
            if (terminate && env.isProd) {
                worker.terminate();
            }
        };
        // send message to start generation
        const init = {
            files: state.files,
            config: {
                platform: state.platform,
            },
            origin: window.location.origin,
        };
        worker.postMessage(init);
        setState((prevState) => ({
            ...prevState,
            currentStep: 3,
            worker,
        }));
        // show usaved progress alert before leaving
        if (env.isProd) {
            window.addEventListener("beforeunload", (event) => {
                // this message is never shown really.
                event.returnValue = `Are you sure you want to leave?`;
            });
        }
    };
    const pickPlatform = (platform) => {
        (0, Plausible_1.plausible)("Pick platform", { platform });
        setState({ ...state, currentStep: 1, platform });
    };
    const info = state.platform ? Platforms_1.PlatformsInfo[state.platform] : undefined;
    return ((0, jsx_runtime_1.jsx)("div", { className: "Steps", children: (0, jsx_runtime_1.jsxs)(Stepper_1.Stepper, { step: state.currentStep, stepTitles: StepTitles, stepMaxHeights: StepMaxHeights, children: [(0, jsx_runtime_1.jsx)(PlatformSelection_1.PlatformSelection, { pickPlatform: pickPlatform }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ExportInstructions_1.ExportInstructions, { platform: state.platform }), (0, jsx_runtime_1.jsxs)("div", { className: "Steps__nav", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { hueColor: BackColor, onClick: () => setState({ ...state, currentStep: 0 }), children: "Back" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { hueColor: NextColor, onClick: () => setState({ ...state, currentStep: 2 }), children: "Continue" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(FilesSelection_1.FilesSelection, { defaultFilename: info?.defaultFilename, files: state.files, onFilesUpdate: (files) => setState({ ...state, files }) }), (0, jsx_runtime_1.jsxs)("div", { className: "Steps__nav", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { hueColor: BackColor, onClick: () => setState({ ...state, currentStep: 1, files: [] }), children: "Back" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { hueColor: NextColor, disabled: state.files.length === 0, onClick: startGeneration, children: "Generate report!" })] })] }), (0, jsx_runtime_1.jsx)(GenerationProgress_1.GenerationProgress, { working: state.worker !== null, tasks: state.progressTasks, stats: state.progressStats }), (0, jsx_runtime_1.jsx)(ViewDownloadReport_1.ViewDownloadReport, { result: state.result })] }) }));
};
exports.Steps = Steps;
