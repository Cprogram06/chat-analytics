"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabSwitch = exports.TabContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const TabContainer = (props) => ((0, jsx_runtime_1.jsx)("div", { style: {
        display: props.currentValue === props.value ? "block" : "none",
    }, role: "tabpanel", children: props.children }));
exports.TabContainer = TabContainer;
const TabSwitch = (props) => {
    const selected = props.currentValue === props.value;
    return ((0, jsx_runtime_1.jsx)("a", { className: selected ? "active" : "", onClick: () => props.onChange(props.value), role: "tab", "aria-selected": selected, children: props.children }));
};
exports.TabSwitch = TabSwitch;
