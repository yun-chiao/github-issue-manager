import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { UpdateIssue, getIssue } from '../service';
function SingleIssues() {
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const { id } = useParams();
    const dispatch = useDispatch();
    // const mdParser = new MarkdownIt(/* Markdown-it options */);
    const navigate = useNavigate();

    useEffect( () => {
        const getContent = async () => {
            let data = await getIssue(id)
            setTitle(data.title)
            setBody(data.body)
        }
        getContent()
    }, [])

    /// Change the state of body when users type.
    const handleBodyChange = (text) => setBody(text);
    
    /// Change the state of title when users type.
    const handleTitleChange = (text) => setTitle(text);

    /// Navigating to issues page when users click the back button.
    const backToIssues = () => navigate("/issues");

    /// To updata issue data to database when users click the submit button.  
    const updateIssue = () => {
        UpdateIssue(dispatch, navigate, id, body, title);
    }
    return (
        <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
            <div className="bg-white w-1/4 h-full flex flex-col items-center min-h-screen px-14 pt-36">
                <div className="h-16 w-full text-3xl px-2 mb-6">
                    <TextareaAutosize   value={title}
                                        onChange={e => handleTitleChange(e.target.value)}
                                        minRows={1}
                                        maxRows={2}
                                        className="border-none rounded-lg h-full focus:outline-0 w-full"
                    ></TextareaAutosize>
                </div>
                <div className="w-full h-36">
                    <TextareaAutosize   value={body}
                                        onChange={e => handleBodyChange(e.target.value)}
                                        minRows={20}
                                        maxRows={20}
                                        className="border-none bg-slate-100 rounded-lg h-full p-4 focus:outline-0 w-full"
                    ></TextareaAutosize>
                    {/* <MdEditor
                        value={text}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={handleEditorChange}
                    /> */}
                    <div className='w-full flex justify-end mt-2 gap-x-4'>
                        <button className="bg-gray-100 w-16 h-10 rounded-md hover:bg-gray-300" onClick={backToIssues}>返回</button>
                        <button className="bg-gray-100 w-16 h-10 rounded-md hover:bg-gray-300" onClick={updateIssue}>提交</button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default SingleIssues;
