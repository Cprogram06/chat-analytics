"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockData = void 0;
const react_1 = require("react");
const BlockStore_1 = require("@report/BlockStore");
const LoadingGroup_1 = require("@report/components/LoadingGroup");
/**
 * Hook to subscribe to block data updates.
 * Note that this hook alone will not fire the block computation,
 * you have to wrap it in a @see LoadingGroup component.
 */
const useBlockData = (blockKey, args) => {
    const store = (0, BlockStore_1.getBlockStore)();
    const request = { blockKey, args };
    const [data, setData] = (0, react_1.useState)(store.getStoredStatus(request)?.data);
    const ctx = (0, react_1.useContext)(LoadingGroup_1.LoadingContext);
    if (!ctx)
        throw new Error("useBlockData must be used inside a LoadingGroup component");
    (0, react_1.useEffect)(() => {
        const updateData = (status) => {
            // only update data if the new one is not undefined
            // so we keep displaying previous data until the new one is ready
            if (status.data !== undefined)
                setData(status.data);
        };
        store.subscribe(request, updateData);
        ctx.enable(request);
        // set if already loaded
        const status = store.getStoredStatus(request);
        if (status?.data !== undefined)
            setData(status.data);
        return () => {
            store.unsubscribe(request, updateData);
            ctx.disable(request);
        };
    }, [(0, BlockStore_1.idRequest)(request)]);
    return data;
};
exports.useBlockData = useBlockData;
