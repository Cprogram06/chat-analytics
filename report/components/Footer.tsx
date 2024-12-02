import { getDatabase } from "@report/WorkerWrapper";
import { Tooltip } from "@report/components/core/Tooltip";

import GitHub from "@assets/images/logos/github.svg";
import "@assets/styles/Footer.less";

const extraInfo = () => (
    <>
        Report generated at: <b>{getDatabase().generatedAt}</b>
        <br />
        Build date: <b>{env.build.date}</b>
        <br />
        Build version: <b>v{env.build.version}</b>
    </>
);

export default () => <div className="Footer"></div>;
