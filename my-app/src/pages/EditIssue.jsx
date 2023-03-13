import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { UpdateIssue, getIssue, createIssue } from '../service';
import { useCookies } from 'react-cookie';

function EditIssue() {
    const [cookies] = useCookies(['token', 'owner', 'repo']);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const location = useLocation();
    const { id } = useParams();
    const dispatch = useDispatch();
    // const mdParser = new MarkdownIt(/* Markdown-it options */);
    const navigate = useNavigate();

    useEffect( () => {
        const getContent = async () => {
            let data = await getIssue(id, cookies['token'], cookies['owner'], cookies['repo'])
            setTitle(data.title)
            setBody(data.body)
        }
        if(location.pathname.includes('edit')){
            getContent()
        }
    }, [])

    /// Change the state of body when users type.
    const handleBodyChange = (text) => setBody(text);
    
    /// Change the state of title when users type.
    const handleTitleChange = (text) => setTitle(text);

    /// Navigating to issues page when users click the back button.
    const toPreviousPage = () => navigate(-1);

    /// To updata issue data to database when users click the submit button.  
    const updateIssue = () => {
        if(location.pathname.includes('edit')){
            UpdateIssue(dispatch, navigate, id, body, title, cookies['token'], cookies['owner'], cookies['repo']);
        }else if(location.pathname.includes('create')){
            createIssue(navigate, body, title, cookies['token'], cookies['owner'], cookies['repo']);
        }
    }
    return (

        <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
            <div className="bg-white w-list h-full flex flex-col items-center min-h-screen px-14 pt-36">
                <div className="w-full h-[28rem] bg-sky-600 rounded-lg p-6 text-white divide-y-2 divide-sky-200">
                    <TextareaAutosize   value={title}
                                        onChange={e => handleTitleChange(e.target.value)}
                                        minRows={1}
                                        maxRows={2}
                                        className="border-none rounded-lg pb-1 h-full bg-transparent focus:outline-0 w-full text-3xl font-normal truncate"
                    ></TextareaAutosize>
                    <div className="">
                        <TextareaAutosize   value={body}
                                            onChange={e => handleBodyChange(e.target.value)}
                                            minRows={14}
                                            maxRows={14}
                                            className="border-none bg-transparent h-full pt-4 focus:outline-0 w-full"
                        ></TextareaAutosize>
                    </div>
                </div>
                <div className='w-full flex justify-end mt-2 gap-x-4 text-white'>
                    <button className="bg-sky-600 w-16 h-10 rounded-md hover:bg-sky-700" onClick={toPreviousPage}>返回</button>
                    <button className="bg-sky-600 w-16 h-10 rounded-md hover:bg-sky-700" onClick={updateIssue}>提交</button>
                </div>
            </div>
        </div>
    );
}

export default EditIssue;
