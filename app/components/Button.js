"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
require("@assets/styles/Button.less");
const Button = ({ hueColor, className, style, ...rest }) => {
    const [h, s, l] = hueColor;
    const cssStyles = {
        "--default-color": `hsl(${h}, ${s}%, ${l}%)`,
        "--hover-color": `hsl(${h}, ${s}%, ${l - 5}%)`,
        "--disable-color": `hsl(${h}, 0%, ${l}%)`,
        ...style,
    };
    const classes = `Button ${className}`;
    return "href" in rest ? ((0, jsx_runtime_1.jsx)("a", { className: classes, style: cssStyles, ...rest })) : (
    // @ts-ignore
    (0, jsx_runtime_1.jsx)("button", { className: classes, style: cssStyles, ...rest }));
};
exports.Button = Button;
