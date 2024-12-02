"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
class ErrorBoundary extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            error: undefined,
        };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    render() {
        if (this.state.error !== undefined) {
            const displayError = () => {
                let desc;
                if (this.state.error instanceof Error) {
                    desc = this.state.error.message + "\n\n" + this.state.error.stack;
                }
                else {
                    desc = (this.state.error + "").slice(0, 1000);
                }
                alert(desc);
            };
            return ((0, jsx_runtime_1.jsxs)("div", { className: "ErrorBoundary", children: [(0, jsx_runtime_1.jsxs)("h1", { children: ["This component crashed, please", " ", (0, jsx_runtime_1.jsx)("a", { target: "_blank", href: "https://github.com/mlomb/chat-analytics/issues", children: "report the issue here" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: displayError, children: "View error" })] }));
        }
        return this.props.children;
    }
}
exports.default = ErrorBoundary;
