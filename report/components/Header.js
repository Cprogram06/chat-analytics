"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Text_1 = require("@pipeline/process/nlp/Text");
const WorkerWrapper_1 = require("@report/WorkerWrapper");
const FilterSelect_1 = __importDefault(require("@report/components/FilterSelect"));
const Tabs_1 = require("@report/components/Tabs");
const TimeSelector_1 = __importDefault(require("@report/components/TimeSelector"));
const Title_1 = require("@report/components/Title");
const AuthorLabel_1 = require("@report/components/core/labels/AuthorLabel");
const ChannelLabel_1 = require("@report/components/core/labels/ChannelLabel");
const GuildLabel_1 = require("@report/components/core/labels/GuildLabel");
const banner_png_1 = __importDefault(require("@assets/images/logos/banner.png"));
require("@assets/styles/Header.less");
const channelsFilterOptionsFn = (db) => {
    const options = [
        {
            name: "Select all channels",
            options: db.channels.map((_, i) => i),
        },
    ];
    // let users filter channels by guild
    if (db.guilds.length >= 2) {
        for (let index = 0; index < db.guilds.length; index++) {
            options.push({
                name: ((0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", whiteSpace: "nowrap", alignItems: "center", gap: 6 }, children: ["Select only channels in", (0, jsx_runtime_1.jsx)("div", { className: "FilterSelect__option-list FilterSelect__option-list--selected", style: { "--hue": 0 }, children: (0, jsx_runtime_1.jsx)(GuildLabel_1.GuildLabel, { index: index }) })] })),
                options: db.channels
                    .map((c, i) => [c.guildIndex, i])
                    .filter((c) => c[0] === index)
                    .map((c) => c[1]),
            });
        }
    }
    return options;
};
const authorsFilterOptionsFn = (db) => {
    const botsPresent = db.authors.some((a) => a.b);
    const options = [
        {
            name: "Select all authors" + (botsPresent ? "  (🧍➕🤖)" : ""),
            options: db.authors.map((_, i) => i),
        },
    ];
    if (botsPresent) {
        const allIndexes = new Array(db.authors.length).fill(0).map((_, i) => i);
        options.push({
            name: "Select only human authors (🧍)",
            options: allIndexes.filter((i) => db.authors[i].b !== true),
        }, {
            name: "Select only bot authors (🤖)",
            options: allIndexes.filter((i) => db.authors[i].b === true),
        });
    }
    return options;
};
const Header = (props) => {
    const { sections, section, setSection } = props;
    const database = (0, WorkerWrapper_1.getDatabase)();
    const formatCache = (0, WorkerWrapper_1.getFormatCache)();
    const worker = (0, WorkerWrapper_1.getWorker)();
    const channelsFilterOptions = (0, react_1.useMemo)(() => channelsFilterOptionsFn(database), [database]);
    const authorsFilterOptions = (0, react_1.useMemo)(() => authorsFilterOptionsFn(database), [database]);
    const [selectedChannels, setSelectedChannels] = (0, react_1.useState)(channelsFilterOptions[0].options);
    const [selectedAuthors, setSelectedAuthors] = (0, react_1.useState)(authorsFilterOptions[0].options);
    (0, react_1.useLayoutEffect)(() => worker.updateAuthors(selectedAuthors), [selectedAuthors]);
    (0, react_1.useLayoutEffect)(() => worker.updateChannels(selectedChannels), [selectedChannels]);
    const filterChannels = (0, react_1.useCallback)((_term) => {
        const term = (0, Text_1.matchFormat)(_term);
        return channelsFilterOptions[0].options.filter((i) => formatCache.channels[i].includes(term));
    }, [formatCache]);
    const filterAuthors = (0, react_1.useCallback)((_term) => {
        const term = (0, Text_1.matchFormat)(_term);
        return authorsFilterOptions[0].options.filter((i) => formatCache.authors[i].includes(term));
    }, [formatCache]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "Header", children: [(0, jsx_runtime_1.jsxs)("header", { className: "Header__info", children: [(0, jsx_runtime_1.jsxs)("span", { className: "Header__title", children: [(0, jsx_runtime_1.jsx)("h1", { children: (0, jsx_runtime_1.jsx)(Title_1.Title, {}) }), (0, jsx_runtime_1.jsx)("h2", { children: "chat analysis report" })] }), (0, jsx_runtime_1.jsx)("div", { className: "Header__link", children: (0, jsx_runtime_1.jsx)("a", { href: "https://twitter.com/QU3ST_io?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor", target: "_blank", children: (0, jsx_runtime_1.jsx)("img", { src: banner_png_1.default, alt: "chatanalytics.app logo", height: "60" }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "Filters", children: [(0, jsx_runtime_1.jsxs)("div", { className: "Filters__Filter", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "channels", children: "Channels" }), (0, jsx_runtime_1.jsx)(FilterSelect_1.default, { options: channelsFilterOptions[0].options, isDisabled: channelsFilterOptions[0].options.length < 2, placeholder: "Select channels...", selected: selectedChannels, onChange: setSelectedChannels, optionColorHue: 266, itemComponent: ChannelLabel_1.ChannelLabel, filterOptions: channelsFilterOptions, filterSearch: filterChannels })] }), (0, jsx_runtime_1.jsxs)("div", { className: "Filters__Filter", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "authors", children: "Authors" }), (0, jsx_runtime_1.jsx)(FilterSelect_1.default, { options: authorsFilterOptions[0].options, isDisabled: authorsFilterOptions[0].options.length < 2, placeholder: "Select authors...", selected: selectedAuthors, onChange: setSelectedAuthors, optionColorHue: 240, itemComponent: AuthorLabel_1.AuthorLabel, filterOptions: authorsFilterOptions, filterSearch: filterAuthors })] }), (0, jsx_runtime_1.jsxs)("div", { className: "Filters__Filter", style: { minWidth: "100%" }, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "authors", children: "Time" }), (0, jsx_runtime_1.jsx)(TimeSelector_1.default, {})] })] }), (0, jsx_runtime_1.jsx)("nav", { className: "Header__Tabs", role: "tablist", children: sections.map((t) => ((0, jsx_runtime_1.jsx)(Tabs_1.TabSwitch, { currentValue: section, onChange: setSection, value: t.value, children: t.name }, t.value))) })] }));
};
exports.default = Header;
