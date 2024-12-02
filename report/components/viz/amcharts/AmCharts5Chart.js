"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmCharts5Chart = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_intersection_observer_1 = require("react-intersection-observer");
const amcharts5_1 = require("@amcharts/amcharts5");
const Animated_1 = __importDefault(require("@amcharts/amcharts5/themes/Animated"));
const Dark_1 = __importDefault(require("@amcharts/amcharts5/themes/Dark"));
const AmCharts5_1 = require("@report/components/viz/amcharts/AmCharts5");
/**
 * Wrapper for AmCharts5 charts, to avoid common boilerplate.
 * Be careful with the `create` function, it will recreate the chart if it changes. You may want to memoize it.
 */
const AmCharts5Chart = (props) => {
    const chartDiv = (0, react_1.useRef)(null);
    const rootRef = (0, react_1.useRef)(undefined);
    const setDataRef = (0, react_1.useRef)(() => { });
    // track if the chart is in view
    const { inView, ref: inViewRef } = (0, react_intersection_observer_1.useInView)({
        threshold: 0,
        initialInView: false,
        fallbackInView: true,
    });
    // this should be set to true only once and then stay true
    const shouldBeCreated = 
    // either the chart is in view
    inView ||
        // or the chart already exists (and we want to keep it that way)
        rootRef.current !== undefined;
    // this deps trigger a chart recreation
    const chartDeps = [shouldBeCreated, props.animated, props.createTheme, props.create];
    (0, react_1.useLayoutEffect)(() => {
        if (!shouldBeCreated)
            return;
        const root = amcharts5_1.Root.new(chartDiv.current);
        root.setThemes((props.animated === true
            ? [Dark_1.default.new(root), Animated_1.default.new(root)]
            : [Dark_1.default.new(root)]).concat(props.createTheme ? [props.createTheme(root)] : []));
        const container = root.container.children.push(amcharts5_1.Container.new(root, {
            width: amcharts5_1.p100,
            height: amcharts5_1.p100,
            layout: root.verticalLayout,
        }));
        const ret = props.create(container);
        let setData;
        let cleanup;
        if (Array.isArray(ret)) {
            setData = ret[0];
            cleanup = ret[1];
        }
        else {
            setData = ret;
        }
        rootRef.current = root;
        setDataRef.current = setData;
        const cleanupDebounce = (0, AmCharts5_1.enableDebouncedResize)(root);
        return () => {
            if (cleanup)
                cleanup();
            cleanupDebounce();
            root.dispose();
        };
    }, chartDeps);
    (0, react_1.useLayoutEffect)(() => {
        if (props.data !== undefined)
            setDataRef.current(props.data);
    }, chartDeps.concat([props.data]));
    (0, react_1.useLayoutEffect)(() => {
        // enable ticking only if in view
        if (rootRef.current) {
            rootRef.current.updateTick = inView;
            // ⚠️ make sure to resize the chart when it becomes visible
            // because we debounced the resize and since the chart was not visible, it was not resized
            if (inView)
                rootRef.current.resize();
        }
    }, chartDeps.concat([inView]));
    return ((0, jsx_runtime_1.jsx)("div", { ref: inViewRef, children: (0, jsx_runtime_1.jsx)("div", { ref: chartDiv, className: props.className, style: props.style }) }));
};
exports.AmCharts5Chart = AmCharts5Chart;
