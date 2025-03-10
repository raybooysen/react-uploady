// @flow
import React, { useCallback, useEffect, useRef } from "react";
import { logger } from "@rpldy/shared";
import createUploader, { composeEnhancers } from "@rpldy/uploader";
import {
    createUploadyStory,
    getCsfExport,
    getTusStoryArgs,
    type CsfExport,
    type UploadyStory,
} from "../../../story-helpers";
import getTusEnhancer from "./src";
import Readme from "./TusSender.storydoc.mdx";

import type { Node } from "react";
import type { UploadyUploaderType, UploaderEnhancer } from "@rpldy/uploader";
import type { TusOptions } from "./src";

logger.setDebug(true);

type StoryProps = {
    enhancer?: ?UploaderEnhancer<any>,
    destination?: any,
    destinationType?: string,
    chunkSize?: number,
    parallel?: number,
    forgetOnSuccess?: boolean,
    ignoreModifiedDateInStorage?: boolean,
    sendDataOnCreate?: boolean,
    resumeStorage?: boolean,
    featureDetection?: boolean,
    onFeaturesDetected?: (string[]) => ?TusOptions,
}

const useUploaderWithTus = ({
                                enhancer,
                                destination,
                                destinationType,
                                parallel,
                                forgetOnSuccess,
                                resumeStorage,
                                ignoreModifiedDateInStorage,
                                sendDataOnCreate,
                                chunkSize,
                                featureDetection,
                                onFeaturesDetected,
                            }: StoryProps) => {
    const uploaderRef = useRef<?UploadyUploaderType>(null);

    useEffect(() => {
        const tusEnhancer = getTusEnhancer({
            parallel,
            chunkSize,
            forgetOnSuccess,
            resume: resumeStorage,
            ignoreModifiedDateInStorage: !ignoreModifiedDateInStorage,
            sendDataOnCreate: sendDataOnCreate,
            featureDetection,
            onFeaturesDetected,
        });

        uploaderRef.current = createUploader({
            enhancer: enhancer ?
                composeEnhancers(enhancer, tusEnhancer) :
                tusEnhancer,
            destination,
            params: {
                source: "rpldy",
                test: "storybook",
            },
        });
    }, [enhancer, destination, destinationType]);

    return uploaderRef;
};

export const WithTusSender: UploadyStory = createUploadyStory((props): Node => {
    const inputRef = useRef<?HTMLInputElement>(null);
    const uploaderRef = useUploaderWithTus(props);

    const onClick = useCallback(() => {
        const input = inputRef.current;
        if (input) {
            input.value = "";
            input.click();
        }
    }, []);

    const onInputChange = useCallback(() => {
        uploaderRef.current?.add(inputRef.current?.files);
    }, []);

    return (
        <div>
            <p>Uses Uploader & TUS Sender</p>
            <input
                type="file"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={onInputChange}
            />
            <button id="upload-button" onClick={onClick}>
                Upload with TUS
            </button>
        </div>
    );
});

export const WithTusDataOnCreate: UploadyStory = createUploadyStory((props): Node => {
    const inputRef = useRef<?HTMLInputElement>(null);
    const uploaderRef = useUploaderWithTus(props);

    const onClick = useCallback(() => {
        const input = inputRef.current;
        if (input) {
            input.value = "";
            input.click();
        }
    }, []);

    const onInputChange = useCallback(() => {
        uploaderRef.current?.add(inputRef.current?.files);
    }, []);

    return (
        <div>
            <p>Uses Uploader & TUS Sender with data on create</p>
            <input
                type="file"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={onInputChange}
            />
            <button id="upload-button" onClick={onClick}>
                Upload with TUS
            </button>
        </div>
    );
});

export const WithTusConcatenation: UploadyStory = createUploadyStory((props): Node => {
    const inputRef = useRef<?HTMLInputElement>(null);
    const uploaderRef = useUploaderWithTus(props);

    const onClick = useCallback(() => {
        const input = inputRef.current;
        if (input) {
            input.value = "";
            input.click();
        }
    }, []);

    const onInputChange = useCallback(() => {
        uploaderRef.current?.add(inputRef.current?.files);
    }, []);

    return (
        <div>
            <p>Uses Uploader & TUS Sender with data on create</p>
            <input
                type="file"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={onInputChange}
            />
            <button id="upload-button" onClick={onClick}>
                Upload with TUS
            </button>
        </div>
    );
});

export const WithFeatureDetection: UploadyStory = createUploadyStory((props): Node => {
    const inputRef = useRef<?HTMLInputElement>(null);
    const uploaderRef = useUploaderWithTus({
        featureDetection: true,
        onFeaturesDetected: (extensions: string[]) => {
            return ~extensions.indexOf("concatenation") ? { parallel: 2 } : null;
        },
    });

    const onClick = useCallback(() => {
        const input = inputRef.current;
        if (input) {
            input.value = "";
            input.click();
        }
    }, []);

    const onInputChange = useCallback(() => {
        uploaderRef.current?.add(inputRef.current?.files);
    }, []);

    return (
        <div>
            <p>Uses Uploader & TUS Sender with server feature detection</p>
            <input
                type="file"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={onInputChange}
            />
            <button id="upload-button" onClick={onClick}>
                Upload with TUS
            </button>
        </div>
    );
});

const tusSenderStories: CsfExport = getCsfExport(undefined, "TUS Sender", Readme, {
    pkg: "tus-sender",
    section: "Core",
    ...getTusStoryArgs(),
});

export default { ...tusSenderStories, title: "Core/TUS Sender" };
