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
    const toPreviousPage = () => navigate("/issues");

    const toEditIssue = () => navigate(`/edit/${id}`);

    return (
        <div className="bg-sky-900 w-full h-full flex justify-center min-h-screen">
            <div className="bg-white w-list h-full flex flex-col items-center min-h-screen px-14 pt-36">
                <div className="w-full h-[28rem] bg-sky-600 rounded-lg p-6 text-white divide-y-2 divide-sky-200">
                    <div className="w-full text-3xl font-normal truncate pb-1">{title}</div>
                    <div className="">
                        <div className="markdown-body whitespace-pre-wrap text-lg pt-4" style={{background: "transparent", color: "white"}} dangerouslySetInnerHTML={{ __html: body }} />
                    </div>
                </div>
                <div className='w-full flex justify-end mt-2 gap-x-4'>
                    <button className="bg-sky-600  w-16 h-10 rounded-md hover:bg-sky-700 text-white" onClick={toPreviousPage}>返回</button>
                    <button className="bg-sky-600  w-16 h-10 rounded-md hover:bg-sky-700 text-white" onClick={toEditIssue}>編輯</button>
                </div>
            </div>
        </div>
    );
}

export default SingleIssues;
