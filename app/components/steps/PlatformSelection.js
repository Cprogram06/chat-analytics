"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformSelection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button_1 = require("@app/components/Button");
const Platforms_1 = require("@pipeline/Platforms");
const PlatformLogos_1 = require("@assets/PlatformLogos");
const PlatformSelection = ({ pickPlatform }) => ((0, jsx_runtime_1.jsx)("div", { className: "PlatformSelect__buttons", children: Object.entries(Platforms_1.PlatformsInfo).map(([key, p]) => ((0, jsx_runtime_1.jsxs)(Button_1.Button, { hueColor: p.color, onClick: () => pickPlatform(key), children: [PlatformLogos_1.PlatformLogos[key], p.name] }, key))) }));
exports.PlatformSelection = PlatformSelection;
