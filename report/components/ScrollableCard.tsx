import * as fs from "fs";
import { ReactElement, useState } from "react";

import { useBlockData } from "@report/BlockHook";
import { BlockState } from "@report/BlockStore";
import ErrorBoundary from "@report/components/ErrorBoundary";
import { LoadingGroup } from "@report/components/LoadingGroup";
import { Tooltip } from "@report/components/core/Tooltip";
import { AuthorLabel } from "@report/components/core/labels/AuthorLabel";

import InfoIcon from "@assets/images/icons/info.svg";
import "@assets/styles/ScrollableCard.less";

type Title = string | (string | string[])[];

interface Props {
    num: 1 | 2 | 3;
    title: Title;
    tooltip?: ReactElement | string;
    defaultOptions?: number[];
    children: (props: { options: number[] }) => JSX.Element;
}

const ScrollableCard = (props: Props) => {
    const Content = (pp: { state: BlockState }) => {
        const { state } = pp;

        // normalize title, make sure it's an array
        const title = typeof props.title === "string" ? [props.title] : props.title;

        // by default all options are 0
        const [options, setOptions] = useState<number[]>(
            props.defaultOptions || title.filter((a) => typeof a !== "string").map((_) => 0)
        );

        const handleExportClick = () => {
            // Implement your export logic here
            // This function should include code to export the data or perform the desired export action
            console.log("Exporting data...");
            // Create CSV content
            const csvContent = `Author,Positive Messages,Negative Messages\n${AuthorLabel},${
                useBlockData("messages/stats")?.counts.positiveMessages
            },${useBlockData("messages/stats")?.counts.negativeMessages}`;

            // Save CSV content to a file
            const filePath = "data.csv";
            fs.writeFile(filePath, csvContent, "utf8", (error) => {
                if (error) {
                    console.error("Error:", error);
                } else {
                    console.log(`CSV file saved to ${filePath}`);
                }
            });
            // Add your export logic here
        };

        const elements: JSX.Element[] = [];

        let optionIndex = 0;
        for (const entry of title) {
            if (typeof entry === "string") {
                // raw text
                elements.push(<span key={entry}>{entry}</span>);
            } else {
                // select with options
                const localOptionIndex = optionIndex;
                elements.push(
                    // use first option as key
                    <select
                        key={entry[0]}
                        value={options[localOptionIndex]}
                        onChange={(e) =>
                            setOptions((prev) => {
                                const newOptions = [...prev];
                                newOptions[localOptionIndex] = parseInt(e.target.value);
                                return newOptions;
                            })
                        }
                    >
                        {entry.map((o, i) => (
                            <option key={i} value={i}>
                                {o}
                            </option>
                        ))}
                    </select>
                );
                optionIndex++;
            }
        }

        return (
            <>
                <ErrorBoundary>
                    <div
                        className={
                            "ScrollableCard__overlay" +
                            (state === "ready"
                                ? " ScrollableCard__overlay--hidden"
                                : state === "error"
                                ? " ScrollableCard__overlay--error"
                                : "")
                        }
                    ></div>
                    {state === "error" && (
                        <div className="ScrollableCard__error">
                            Error occurred, please check the console for more details
                        </div>
                    )}
                    <div
                        className={`ScrollableCard__title ScrollableCard__title--${state}`}
                        // style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                        {elements}
                        {props.tooltip ? (
                            <Tooltip
                                content={props.tooltip}
                                children={<img src={InfoIcon} height={16} style={{ marginTop: 2 }} />}
                            />
                        ) : null}
                        {/* <button
                            style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            onClick={handleExportClick}
                        >
                            Export Data
                        </button> */}
                    </div>
                    <div
                        className={`ScrollableCard__content ${state === "ready" ? "" : "ScrollableCard__gray"}`}
                        style={{ maxHeight: "680px", overflowY: "auto" }} // Add scrollable styles here
                    >
                        <div className="custom-scrollbar">
                            <props.children options={options} />
                        </div>
                    </div>
                </ErrorBoundary>
            </>
        );
    };

    return (
        <div className={`ScrollableCard ScrollableCard--${props.num}`}>
            <LoadingGroup children={(state) => <Content state={state} />} />
        </div>
    );
};

export default ScrollableCard;
