"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Text_1 = require("@pipeline/process/nlp/Text");
const SearchInput_1 = __importDefault(require("@report/components/core/SearchInput"));
const AnimatedBars_1 = __importDefault(require("@report/components/viz/AnimatedBars"));
const MostUsed = (props) => {
    const [filter, setFilter] = (0, react_1.useState)("");
    const entries = (0, react_1.useMemo)(() => {
        let finalFilter = filter;
        let exactIndex = -1;
        if (props.searchable && !(filter instanceof RegExp)) {
            // string
            finalFilter = (0, Text_1.matchFormat)(props.transformFilter ? props.transformFilter(filter) : filter);
            exactIndex = props.indexOf(finalFilter);
        }
        let entries = [];
        for (const [i, c] of (props.counts || []).entries()) {
            entries.push({
                index: i,
                value: c,
                pin: exactIndex === i,
            });
        }
        entries = entries
            .filter((c) => c.value > 0 &&
            (filter === "" || c.pin || (props.searchable && props.inFilter(c.index, finalFilter))) &&
            (!props.filter || props.filter(c.index)))
            .sort((a, b) => b.value - a.value)
            .slice(0, props.maxItems);
        return entries;
    }, [props.counts, props.maxItems, props.filter, filter]); // we use other props in this memo but I WILL assume they don't change
    // memo component
    const Item = (0, react_1.useMemo)(() => ({ index, pin }) => {
        const ItemComponent = props.itemComponent;
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ItemComponent, { index: index }), pin && (0, jsx_runtime_1.jsx)("span", { className: "AnimatedBars__exact", children: "EXACT" })] }));
    }, [props.itemComponent]);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [props.searchable === true && ((0, jsx_runtime_1.jsx)(SearchInput_1.default, { placeholder: props.searchPlaceholder, onChange: setFilter, allowRegex: props.allowRegex })), (0, jsx_runtime_1.jsx)(AnimatedBars_1.default, { what: props.what, unit: props.unit, data: entries, itemComponent: Item, maxItems: props.maxItems, colorHue: props.colorHue, selectable: props.selectable, selected: props.selected, onSelectChange: props.onSelectChange })] }));
};
exports.default = (0, react_1.memo)(MostUsed);
