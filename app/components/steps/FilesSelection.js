"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesSelection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const react_1 = require("react");
const Button_1 = require("@app/components/Button");
const FilesSelection = ({ defaultFilename, files, onFilesUpdate }) => {
    const fileRef = (0, react_1.useRef)(null);
    const [dragover, setDragover] = (0, react_1.useState)(false);
    const onFileClick = () => fileRef.current.click();
    const mergeFiles = (newFiles) => {
        const merged = [...files];
        newFiles.forEach((file) => {
            for (const existingFile of merged) {
                if (existingFile.name === file.name &&
                    existingFile.size === file.size &&
                    existingFile.lastModified === file.lastModified) {
                    return;
                }
            }
            merged.push(file);
        });
        onFilesUpdate(merged);
    };
    const onFileChange = () => {
        mergeFiles(Array.from(fileRef.current.files));
        fileRef.current.value = "";
    };
    const onDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switch (e.type) {
            case "dragover":
            case "dragenter":
                setDragover(true);
                break;
            case "dragleave":
            case "dragend":
                setDragover(false);
                break;
            case "drop":
                setDragover(false);
                mergeFiles(Array.from(e.dataTransfer.files));
                break;
        }
    };
    const onClear = () => {
        onFilesUpdate([]);
        fileRef.current.value = "";
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "FilesSelect", children: ["Select the files from the previous step:", (0, jsx_runtime_1.jsxs)("div", { className: "FilesSelect__zone", children: [(0, jsx_runtime_1.jsxs)("button", { className: ["FilesSelect__dropzone", dragover ? "FilesSelect__dropzone--dragover" : ""].join(" "), onClick: onFileClick, onDrop: onDrag, onDragOver: onDrag, onDragEnd: onDrag, onDragEnter: onDrag, onDragLeave: onDrag, children: ["Drop ", (0, jsx_runtime_1.jsx)("span", { children: defaultFilename }), " files here", (0, jsx_runtime_1.jsx)("br", {}), "or click to browse"] }), (0, jsx_runtime_1.jsxs)("div", { className: "FilesSelect__info", children: [files.length === 0 ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "No files selected" })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [files.length, " file", files.length === 1 ? "" : "s", " selected (", (0, pretty_bytes_1.default)(files.reduce((acc, file) => acc + file.size, 0)), ")"] })), (0, jsx_runtime_1.jsx)(Button_1.Button, { className: "FilesSelect__clear", hueColor: [0, 50, 50], onClick: onClear, disabled: files.length === 0, children: "Clear" })] })] }), (0, jsx_runtime_1.jsx)("input", { type: "file", hidden: true, multiple: true, onChange: onFileChange, ref: fileRef })] }));
};
exports.FilesSelection = FilesSelection;
