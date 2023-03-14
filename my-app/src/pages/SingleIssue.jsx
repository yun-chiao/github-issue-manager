import MarkdownIt from 'markdown-it';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getIssue } from '../service';
import { useCookies } from 'react-cookie';
import TextareaAutosize from 'react-textarea-autosize';
import './markdown.css'

function SingleIssues() {
    const [cookies] = useCookies(['token', 'owner', 'repo']);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const { id } = useParams();
    const mdParser = new MarkdownIt(/* Markdown-it options */);
    const bodyRef = useRef(null);
    const titleRef = useRef(null);
    const navigate = useNavigate();
    const [isBodyFocus, setIsBodyFocus] = useState(false);
    const [isTitleFocus, setIsTitleFocus] = useState(false);

    /// Change the state of body when users type.
    const handleBodyChange = (text) => setBody(text);
  
    /// Change the state of title when users type.
    const handleTitleChange = (text) => setTitle(text);

    /// [isFocus] will be true if users click body content, and users can edit it.
    const handleEditorFocus = () => setIsBodyFocus(true);        
    
    /// [isFocus] will be false if users click not focus on body content, and users can't edit it.
    const handleEditorBlur = () => setIsBodyFocus(false);

    /// [isFocus] will be true if users click body content, and users can edit it.
    const handleTitleFocus = () => setIsTitleFocus(true);        
    
    /// [isFocus] will be false if users click not focus on body content, and users can't edit it.
    const handleTitleBlur = () => setIsTitleFocus(false);

    // Check if the body can be edited.
    useEffect(() => {
        if(isBodyFocus){
            bodyRef.current.focus();
        }
    }, [isBodyFocus])

    // Check if the body can be edited.
    useEffect(() => {
        if(isTitleFocus){
            titleRef.current.focus();
        }
    }, [isTitleFocus])
    
    useEffect( () => {
        const getContent = async () => {
            let data = await getIssue(id, cookies['token'], cookies['owner'], cookies['repo'])
            setTitle(data.title)
            setBody(data.body)
        }
        getContent()
    }, [])

    /// Navigating to issues page when users click the back button.
    const toPreviousPage = () => navigate("/issues");

    const toEditIssue = () => navigate(`/edit/${id}`);

    return (
        <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
            <div className="bg-white w-list h-full flex flex-col items-center min-h-screen">
                <div className='w-full flex justify-end items-center gap-x-4 sticky top-0 bg-sky-600 h-16 px-10'>
                    <button className="bg-sky-700 w-16 h-10 rounded-md hover:bg-sky-900 text-white" onClick={toPreviousPage}>返回</button>
                    <button className="bg-sky-700  w-16 h-10 rounded-md hover:bg-sky-900 text-white" onClick={toEditIssue}>提交</button>
                </div>
                <div className="w-full min-h-screen bg-white p-10 text-black divide-y-2 divide-sky-200">
                    <div className='pb-2 text-3xl font-normal cursor-text'>
                        <div onClick={handleTitleFocus} className={`w-full ${isTitleFocus?"hidden":""} truncate`}>{title}</div>
                        <TextareaAutosize   onBlur={handleTitleBlur}
                                            ref={titleRef}
                                            value={title}
                                            onChange={e => handleTitleChange(e.target.value)}
                                            minRows={1}
                                            maxRows={1}
                                            className={`border-none h-full bg-transparent focus:outline-0 truncate ${!isTitleFocus?"hidden":""} `}
                        ></TextareaAutosize>
                    </div>
                        <div onClick={handleEditorFocus}
                            onBlur={handleEditorBlur}
                            className="pt-2 cursor-text">
                            <div className={`whitespace-pre text-lg pt-4 ${isBodyFocus?"hidden":""}`} 
                                style={{background: "transparent", color: "black"}}
                                dangerouslySetInnerHTML={{ __html:  mdParser.render(body) }} 
                            />
                            <TextareaAutosize   value={body}
                                onChange={e => handleBodyChange(e.target.value)}
                                minRows={1}
                                ref={bodyRef}
                                className={`border-none bg-transparent h-full pt-4 focus:outline-1 outline-sky-700 focus:caret-blue-500 w-full ${!isBodyFocus?"hidden":""}`}
                            ></TextareaAutosize>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default SingleIssues;
