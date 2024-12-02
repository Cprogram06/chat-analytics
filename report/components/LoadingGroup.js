"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingGroup = exports.LoadingContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_intersection_observer_1 = require("react-intersection-observer");
const BlockStore_1 = require("@report/BlockStore");
exports.LoadingContext = (0, react_1.createContext)(null);
/**
 * Combines the states provided based on the following rules:
 * - If ANY state is `error`, `error` is returned
 * - If ALL states are `ready`, `ready` is returned
 * - If ANY state is `processing`, `processing` is returned
 * - else `waiting` is returned
 */
const combineStates = (states) => {
    const anyError = states.some((s) => s === "error");
    const allReady = states.every((s) => s === "ready");
    const anyProcessing = states.some((s) => s === "processing");
    if (anyError)
        return "error";
    if (allReady)
        return "ready";
    if (anyProcessing)
        return "processing";
    return "waiting";
};
/**
 * Wraps a component which receives a combined BlockState for all block requests inside its children.
 * It enables the computation of those block requests.
 */
const LoadingGroup = (props) => {
    const store = (0, BlockStore_1.getBlockStore)();
    const [requests, setRequests] = (0, react_1.useState)([]);
    const [_, rerender] = (0, react_1.useState)(0);
    const { inView, ref } = (0, react_intersection_observer_1.useInView)({
        threshold: 0,
        fallbackInView: true,
    });
    // ctx
    const enable = (0, react_1.useCallback)((request) => setRequests((R) => [...R, request]), []);
    const disable = (0, react_1.useCallback)((request) => setRequests((R) => R.filter((r) => r !== request)), []);
    const ctxValue = (0, react_1.useMemo)(() => ({ enable, disable }), [enable, disable]);
    (0, react_1.useEffect)(() => {
        if (inView === false)
            return;
        // enable in store
        requests.forEach((req) => store.enable(req));
        // disable in store
        return () => requests.forEach((req) => store.disable(req));
    }, [requests, inView]);
    (0, react_1.useEffect)(() => {
        const trigger = () => rerender(Math.random());
        // subscribe to all
        requests.forEach((req) => store.subscribe(req, trigger));
        // unsubscribe on unmount
        return () => requests.forEach((req) => store.unsubscribe(req, trigger));
    }, [requests]);
    const state = combineStates(requests.map((req) => store.getStoredStatus(req).state));
    return ((0, jsx_runtime_1.jsx)("div", { ref: ref, "data-info": "observer", children: (0, jsx_runtime_1.jsx)(exports.LoadingContext.Provider, { value: ctxValue, children: props.children(state) }) }));
};
exports.LoadingGroup = LoadingGroup;
