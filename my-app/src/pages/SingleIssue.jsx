import MarkdownIt from 'markdown-it';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UpdateIssue, getIssue, createIssue } from '../service';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import './markdown.css'

function SingleIssues() {
    const [cookies] = useCookies(['token', 'owner', 'repo']);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const location = useLocation();
    const { id } = useParams();
    const mdParser = new MarkdownIt(/* Markdown-it options */);
    const bodyRef = useRef(null);
    const titleRef = useRef(null);
    const dispatch = useDispatch();
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const getContent = async () => {
            let data = await getIssue(id, cookies['token'], cookies['owner'], cookies['repo'])
            setTitle(data.title)
            setBody(data.body)
        }
        if(location.pathname.includes('edit')){
            getContent()
        }
    }, [])

    /// Navigating to issues page when users click the back button.
    const toPreviousPage = () => navigate("/issues");

    /// To updata issue data to database when users click the submit button.  
    const updateIssue = async () => {
        if(body.length < 30){
            console.log("要大於30字");
            return;
        }else if(title.length === 0){
            console.log("要有title");
            return;
        }
        if(location.pathname.includes('edit')){
            await UpdateIssue(dispatch, id, body, title, cookies['token'], cookies['owner'], cookies['repo']);
        }else if(location.pathname.includes('create')){
            await createIssue(body, title, cookies['token'], cookies['owner'], cookies['repo']);
        }
        navigate('/issues')
    }
    return (
        <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
            <div className="bg-white w-list h-full flex flex-col items-center min-h-screen">
                <div className='w-full flex justify-end items-center gap-x-4 sticky top-0 bg-sky-600 h-20 px-10'>
                    <button className="bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm" onClick={toPreviousPage}>返回</button>
                    <button className="bg-sky-700 hover:bg-sky-800 text-white w-12 h-8 rounded-md text-sm" onClick={updateIssue}>提交</button>
                </div>
                <div className="w-full min-h-screen bg-white p-10 text-black divide-y-2 divide-sky-200">
                    <div className='pb-2 text-3xl font-normal cursor-text'>
                        <div onClick={handleTitleFocus} className={`w-full ${isTitleFocus || title.length===0?"hidden":""} truncate`}>{title}</div>
                        <TextareaAutosize   onBlur={handleTitleBlur}
                                            ref={titleRef}
                                            value={title}
                                            onChange={e => handleTitleChange(e.target.value)}
                                            minRows={1}
                                            maxRows={1}
                                            placeholder={"請輸入標題"}
                                            className={`border-none h-full bg-transparent focus:outline-0 truncate ${isTitleFocus || title.length === 0?"":"hidden"} `}
                        ></TextareaAutosize>
                    </div>
                        <div onClick={handleEditorFocus}
                            onBlur={handleEditorBlur}
                            className="pt-2 cursor-text">
                            <div className={`whitespace-pre text-lg pt-4 ${isBodyFocus || body.length===0?"hidden":""}`} 
                                style={{background: "transparent", color: "black"}}
                                dangerouslySetInnerHTML={{ __html:  mdParser.render(body) }} 
                            />
                            <TextareaAutosize   value={body}
                                onChange={e => handleBodyChange(e.target.value)}
                                minRows={1}
                                ref={bodyRef}
                                placeholder={"請用markdown語法輸入超過30字的內容"}
                                className={`border-none bg-transparent h-full pt-2 focus:outline-1 outline-sky-700 focus:caret-blue-500 w-full ${isBodyFocus || body.length === 0?"":"hidden"}`}
                            ></TextareaAutosize>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default SingleIssues;
