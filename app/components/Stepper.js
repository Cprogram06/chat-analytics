"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stepper = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const tick_svg_1 = __importDefault(require("@assets/images/icons/tick.svg"));
require("@assets/styles/Stepper.less");
const Stepper = ({ step, stepTitles, stepMaxHeights, children }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children.map((child, index) => {
        const active = step === index;
        const done = index < step;
        return ((0, jsx_runtime_1.jsxs)("div", { className: [
                "Stepper__entry",
                active ? "Stepper__entry--active" : "",
                done ? "Stepper__entry--done" : "",
            ].join(" "), style: {
                "--max-height": `${stepMaxHeights[index]}px`,
            }, "aria-hidden": !active, children: [(0, jsx_runtime_1.jsxs)("div", { className: "Stepper__label", children: [(0, jsx_runtime_1.jsx)("div", { className: "Stepper__number", children: done ? (0, jsx_runtime_1.jsx)("img", { src: tick_svg_1.default, height: 20 }) : index + 1 }), stepTitles[index]] }), (0, jsx_runtime_1.jsx)("div", { className: "Stepper__content", children: (0, jsx_runtime_1.jsxs)("fieldset", { disabled: !active, children: [(0, jsx_runtime_1.jsx)("legend", { children: stepTitles[index] }), (0, jsx_runtime_1.jsx)("div", { className: "Stepper__inner", children: child })] }) })] }, index));
    }) }));
exports.Stepper = Stepper;
