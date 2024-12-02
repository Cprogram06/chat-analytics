"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationProgress = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const react_1 = require("react");
const RestartLink_1 = require("@app/components/RestartLink");
const bubble_svg_1 = __importDefault(require("@assets/images/icons/bubble.svg"));
const clock_svg_1 = __importDefault(require("@assets/images/icons/clock.svg"));
const files_svg_1 = __importDefault(require("@assets/images/icons/files.svg"));
const hashtag_svg_1 = __importDefault(require("@assets/images/icons/hashtag.svg"));
const pause_svg_1 = __importDefault(require("@assets/images/icons/pause.svg"));
const spinner_svg_1 = __importDefault(require("@assets/images/icons/spinner.svg"));
const tick_svg_1 = __importDefault(require("@assets/images/icons/tick.svg"));
const times_svg_1 = __importDefault(require("@assets/images/icons/times.svg"));
const user_svg_1 = __importDefault(require("@assets/images/icons/user.svg"));
const prettyBytesAligned = (n) => (0, pretty_bytes_1.default)(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TaskProgress = ({ actual, total, format, }) => ((0, jsx_runtime_1.jsxs)("span", { className: "TaskItem__progress", children: [format(actual), total !== undefined && actual < total ? "/" + format(total) : ""] }));
const TaskItem = ({ task: { title, subject, status, progress } }) => ((0, jsx_runtime_1.jsxs)("div", { className: `TaskItem TaskItem--status-${status}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "TaskItem__icon", children: (0, jsx_runtime_1.jsx)("img", { src: status === "processing"
                    ? spinner_svg_1.default
                    : status === "success"
                        ? tick_svg_1.default
                        : status === "waiting"
                            ? pause_svg_1.default
                            : times_svg_1.default }) }), (0, jsx_runtime_1.jsx)("span", { className: "TaskItem__title", children: title }), (0, jsx_runtime_1.jsx)("span", { className: "TaskItem__subject", title: subject, children: subject }), progress &&
            (progress.format === "number" ? ((0, jsx_runtime_1.jsx)(TaskProgress, { ...progress, format: (value) => value.toLocaleString() })) : ((0, jsx_runtime_1.jsx)(TaskProgress, { ...progress, format: prettyBytesAligned })))] }));
const Timer = ({ ticking }) => {
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(() => {
        const start = Date.now();
        // no need to use a library for this...
        const formatDiff = () => {
            const seconds = Math.floor((Date.now() - start) / 1000);
            const s = seconds % 60;
            const m = Math.floor(seconds / 60);
            return (m + "").padStart(2, "0") + ":" + (s + "").padStart(2, "0");
        };
        if (ticking) {
            const updateText = () => (ref.current ? (ref.current.innerText = formatDiff()) : undefined);
            const id = setInterval(updateText, 1000);
            return () => clearInterval(id);
        }
    }, [ticking]);
    return (0, jsx_runtime_1.jsx)("span", { ref: ref, children: "00:00" });
};
const ErrorBox = ({ error }) => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "ErrorBox", children: error }), (0, jsx_runtime_1.jsx)(RestartLink_1.RestartLink, { text: "Start again" })] }));
const GenerationProgress = (props) => {
    const error = props.tasks[props.tasks.length - 1].error;
    const stat = (name) => (props.stats[name] || 0).toLocaleString();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "GenerationProgress__stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "GenerationProgress__stat", title: "# of channels", children: [(0, jsx_runtime_1.jsx)("img", { src: hashtag_svg_1.default }), stat("channels")] }), (0, jsx_runtime_1.jsxs)("div", { className: "GenerationProgress__stat", title: "# of authors", children: [(0, jsx_runtime_1.jsx)("img", { src: user_svg_1.default }), stat("authors")] }), (0, jsx_runtime_1.jsxs)("div", { className: "GenerationProgress__stat", title: "# of messages", children: [(0, jsx_runtime_1.jsx)("img", { src: bubble_svg_1.default }), stat("messages")] }), (0, jsx_runtime_1.jsxs)("div", { className: "GenerationProgress__stat", title: "# of input files processed", children: [(0, jsx_runtime_1.jsx)("img", { src: files_svg_1.default }), stat("processed_files"), "/", stat("total_files")] }), (0, jsx_runtime_1.jsxs)("div", { className: "GenerationProgress__stat", title: "time elapsed", children: [(0, jsx_runtime_1.jsx)("img", { src: clock_svg_1.default }), (0, jsx_runtime_1.jsx)(Timer, { ticking: props.working && error === undefined })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "GenerationProgress", children: [props.tasks.slice(-6).map((item, index) => ((0, jsx_runtime_1.jsx)(TaskItem, { task: item }, index))), props.tasks.length > 6 && (0, jsx_runtime_1.jsx)("div", { className: "GenerationProgress__shadow" })] }), error && (0, jsx_runtime_1.jsx)(ErrorBox, { error: error })] }));
};
exports.GenerationProgress = GenerationProgress;
