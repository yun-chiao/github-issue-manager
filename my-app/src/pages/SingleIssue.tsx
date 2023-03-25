import "./markdown.css"

import MarkdownIt from "markdown-it";
import { useEffect, useRef,useState } from "react";
import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import TextareaAutosize from "react-textarea-autosize";

import { useSingleIssue } from "../hook/useIssue";

function SingleIssues(): JSX.Element {
    const mdParser = new MarkdownIt(/* Markdown-it options */);
    const bodyRef = useRef(null);
    const [isBodyFocus, setIsBodyFocus] = useState(false);
    const { body, setBody, title, setTitle, toPreviousPage, updateIssue, isLoading } = useSingleIssue();

    /// Change the state of body when users type.
    const handleBodyChange = (text) => setBody(text);

    /// Change the state of title when users type.
    const handleTitleChange = (text) => setTitle(text);

    /// [isFocus] will be true if users click body content, and users can edit it.
    const handleEditorFocus = () => setIsBodyFocus(true);

    /// [isFocus] will be false if users click not focus on body content, and users can't edit it.
    const handleEditorBlur = () => setIsBodyFocus(false);

    // Check if the body can be edited.
    useEffect(() => {
        if (isBodyFocus) {
            bodyRef.current.focus();
        }
    }, [isBodyFocus])

    return (
        <>

            <div className="flex h-full min-h-screen w-full justify-center bg-sky-900">
                <div className="flex h-full min-h-screen w-list flex-col items-center bg-white">
                    <div className='sticky top-0 flex h-20 w-full items-center justify-end gap-x-4 bg-sky-600 px-10'>
                        {isLoading ? <></> : (<>
                            <button className="h-8 w-12 rounded-md bg-sky-700 text-sm text-white hover:bg-sky-800"
                                onClick={toPreviousPage}>
                                返回
                            </button>
                            <button className="h-8 w-12 rounded-md bg-sky-700 text-sm text-white hover:bg-sky-800"
                                onClick={updateIssue}>
                                提交
                            </button>
                        </>)}
                    </div>
                    {isLoading ? <div className='withoutHeader flex w-full flex-col items-center justify-center pr-12'><PacmanLoader color='#3785A8' speedMultiplier={2} size={30} /></div> : (
                        <>
                            <div className="withoutHeader w-full divide-y-2 divide-sky-200 bg-white p-10 text-black">
                                <div className='cursor-text pb-2 text-3xl font-normal'>
                                    <input value={title}
                                        onChange={e => handleTitleChange(e.target.value)}
                                        placeholder={"請輸入標題"}
                                        className={"h-full w-full truncate border-none bg-transparent focus:outline-0"}>
                                    </input>
                                </div>
                                <div onClick={handleEditorFocus}
                                    onBlur={handleEditorBlur}
                                    className="cursor-text pt-2">
                                    <div className={`whitespace-pre pt-4 text-lg ${isBodyFocus || body.length === 0 ? "hidden" : ""}`}
                                        style={{
 background: "transparent", color: "black" 
}}
                                        dangerouslySetInnerHTML={{
 __html: mdParser.render(body) 
}}
                                    />
                                    <TextareaAutosize value={body}
                                        onChange={e => handleBodyChange(e.target.value)}
                                        minRows={1}
                                        ref={bodyRef}
                                        placeholder={"請用markdown語法輸入超過30字的內容"}
                                        className={`h-full w-full border-none bg-transparent pt-2 outline-sky-700 focus:caret-blue-500 focus:outline-1 ${isBodyFocus || body.length === 0 ? "" : "hidden"}`}
                                    ></TextareaAutosize>
                                </div>
                            </div>
                        </>)}
                </div>
            </div>


        </>

    );
}

export default SingleIssues;
