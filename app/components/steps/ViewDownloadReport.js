"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewDownloadReport = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const react_1 = require("react");
const Button_1 = require("@app/components/Button");
const RestartLink_1 = require("@app/components/RestartLink");
const Plausible_1 = require("@assets/Plausible");
const download_svg_1 = __importDefault(require("@assets/images/icons/download.svg"));
const link_out_svg_1 = __importDefault(require("@assets/images/icons/link-out.svg"));
const ViewDownloadReport = ({ result }) => {
    const [files, setFiles] = (0, react_1.useState)({
        dataBlob: null,
        dataURL: "",
        htmlBlob: null,
        htmlURL: "",
        filename: "",
    });
    (0, react_1.useEffect)(() => {
        if (result) {
            const date = new Date();
            const dataBlob = new Blob([result.data || ""], { type: "text/plain" });
            const htmlBlob = new Blob([result.html], { type: "text/html" });
            setFiles({
                dataBlob,
                dataURL: URL.createObjectURL(dataBlob),
                htmlBlob,
                htmlURL: URL.createObjectURL(htmlBlob),
                filename: `${result.title}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.html`,
            });
        }
    }, [result]);
    const onDownload = () => (0, Plausible_1.plausible)("Download report");
    const onOpenLocally = () => (0, Plausible_1.plausible)("Open report");
    const Stats = ({ result }) => {
        const stats = [
            {
                prefix: "It contains",
                value: result.counts.messages,
                name: "message",
                hue: 61,
                alwaysShow: true,
            },
            {
                prefix: "from",
                value: result.counts.authors,
                name: "author",
                hue: 240,
                alwaysShow: true,
            },
            {
                prefix: "in",
                value: result.counts.channels,
                name: "channel",
                hue: 266,
                alwaysShow: false,
            },
            {
                prefix: "in",
                value: result.counts.guilds,
                name: "guild",
                hue: 0,
                alwaysShow: false,
            },
        ].filter((stat) => stat.alwaysShow || stat.value > 1);
        // trailing s
        const ts = (n) => (n === 1 ? "" : "s");
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [stats.map((stat, i) => ((0, jsx_runtime_1.jsxs)("span", { children: [i > 0 ? " " : "", stat.prefix, " ", (0, jsx_runtime_1.jsx)("b", { style: { color: `hsl(${stat.hue}, 100%, 74%)` }, children: stat.value.toLocaleString() + " " + stat.name + ts(stat.value) })] }, i))), "."] }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ViewDownloadReport", children: [result && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Your report ", (0, jsx_runtime_1.jsxs)("b", { children: ["\"", result.title, "\""] }), " is ready!", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(Stats, { result: result })] })), (0, jsx_runtime_1.jsxs)("div", { className: "ViewDownloadReport__buttons", children: [(0, jsx_runtime_1.jsxs)(Button_1.Button, { hueColor: [258, 90, 61], href: files.htmlURL, download: files.filename, onClick: onDownload, children: [(0, jsx_runtime_1.jsx)("img", { src: download_svg_1.default, alt: "Download", height: 16 }), "Download (", (0, pretty_bytes_1.default)(files.htmlBlob?.size || 0), ")"] }), (0, jsx_runtime_1.jsxs)(Button_1.Button, { hueColor: [244, 90, 61], href: files.htmlURL, target: "_blank", onClick: onOpenLocally, children: [(0, jsx_runtime_1.jsx)("img", { src: link_out_svg_1.default, alt: "Link out", height: 16 }), "View Locally"] }), env.isDev && ((0, jsx_runtime_1.jsxs)(Button_1.Button, { hueColor: [115, 70, 50], href: files.dataURL, download: "report_sample.data", children: ["\uD83D\uDEE0\uFE0F Download DATA (dev, ", (0, pretty_bytes_1.default)(files.dataBlob?.size || 0), ")"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "ViewDownloadReport__notice", children: ["Remember that we don't store your reports, so you can't share the \"View Locally\" link. To share the report, ", (0, jsx_runtime_1.jsx)("b", { children: "download it and share the file" }), "."] }), (0, jsx_runtime_1.jsx)(RestartLink_1.RestartLink, { text: "Generate a new report" })] }));
};
exports.ViewDownloadReport = ViewDownloadReport;
