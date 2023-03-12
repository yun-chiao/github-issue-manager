import 'github-markdown-css/github-markdown.css';
import MarkdownIt from 'markdown-it';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getIssue } from '../service';

function SingleIssues() {
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const { id } = useParams();
    const mdParser = new MarkdownIt(/* Markdown-it options */);
    const navigate = useNavigate();

    useEffect( () => {
        const getContent = async () => {
            let data = await getIssue(id)
            setTitle(data.title)
            setBody( mdParser.render(data.body))
        }
        getContent()
    }, [])

    /// Navigating to issues page when users click the back button.
    const toPreviousPage = () => navigate(-1);

    const toEditIssue = () => navigate(`/edit/${id}`);

    return (
        <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
            <div className="bg-white w-1/4 h-full flex flex-col items-center min-h-screen px-14 pt-36">
                <div className="h-16 w-full text-3xl mb-6 pl-2 font-normal">{title}</div>
                <div className="w-full h-96 bg-slate-100">
                    <div className="h-full bg-slate-100  rounded-lg">
                        <div className="markdown-body p-4  whitespace-pre-wrap" style={{background: "transparent"}} dangerouslySetInnerHTML={{ __html: body }} />
                    </div>
                </div>
                <div className='w-full flex justify-end mt-2 gap-x-4'>
                        <button className="bg-gray-100 w-16 h-10 rounded-md hover:bg-gray-300" onClick={toPreviousPage}>返回</button>
                        <button className="bg-gray-100 w-16 h-10 rounded-md hover:bg-gray-300" onClick={toEditIssue}>編輯</button>
                    </div>
                
            </div>
        </div>
    );
}

export default SingleIssues;
