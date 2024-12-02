"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Tooltip_1 = require("@report/components/core/Tooltip");
require("@assets/styles/SearchInput.less");
const SearchInput = ({ onChange, placeholder, allowRegex }) => {
    const inputRef = (0, react_1.useRef)(null);
    const [input, setInput] = (0, react_1.useState)(""); // true text value of input
    const [error, setError] = (0, react_1.useState)(false);
    const [regexEnabled, setRegexEnabled] = (0, react_1.useState)(false);
    const onInputChanged = (value, _regexEnabled) => {
        setInput(value);
        if (allowRegex && _regexEnabled) {
            // try to parse input as regular expression
            try {
                const expr = new RegExp(value, "ui");
                onChange(expr);
                setError(false);
            }
            catch (e) {
                // invalid regex
                // pass never matching regex and show error
                onChange(/[]/);
                setError(true);
            }
        }
        else {
            // pass text directly
            onChange(value);
            setError(false);
        }
    };
    const onToggleRegex = (enabled) => {
        setRegexEnabled(enabled);
        onInputChanged(input, enabled);
        // always give the focus back to the input
        inputRef.current?.focus();
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "SearchInput", children: [(0, jsx_runtime_1.jsx)("div", { className: "SearchInput__mag" }), (0, jsx_runtime_1.jsx)("input", { ref: inputRef, className: [
                    "SearchInput__input",
                    allowRegex ? "SearchInput__input--regex" : "",
                    error ? "SearchInput__input--error" : "",
                ].join(" "), type: "text", placeholder: placeholder, value: input, onChange: (e) => onInputChanged(e.target.value, regexEnabled) }), allowRegex && ((0, jsx_runtime_1.jsx)(Tooltip_1.Tooltip, { content: `Use regular expressions to search`, children: (0, jsx_runtime_1.jsx)("input", { className: "SearchInput__regex", type: "checkbox", onMouseDown: (e) => e.preventDefault(), checked: regexEnabled, onChange: (e) => onToggleRegex(e.target.checked) }) }))] }));
};
exports.default = SearchInput;
