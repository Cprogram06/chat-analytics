"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformAvatar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Platforms_1 = require("@pipeline/Platforms");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const PlatformLogos_1 = require("@assets/PlatformLogos");
const PlatformAvatar = () => {
    const db = (0, WorkerWrapper_1.getDatabase)();
    const p = Platforms_1.PlatformsInfo[db.config.platform];
    return ((0, jsx_runtime_1.jsx)("div", { className: "Avatar", children: (0, jsx_runtime_1.jsx)("div", { className: "PlatformAvatar", style: { backgroundColor: `hsl(${p.color[0]}, ${p.color[1]}%, ${p.color[2]}%)` }, children: PlatformLogos_1.PlatformLogos[db.config.platform] }) }));
};
exports.PlatformAvatar = PlatformAvatar;
