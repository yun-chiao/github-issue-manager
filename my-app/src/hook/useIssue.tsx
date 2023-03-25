import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { getIssue, createIssue, UpdateIssue } from '../service';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useSingleIssue = (): {
    body: string;
    setBody: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    toPreviousPage: () => void;
    updateIssue: () => Promise<void>;
    isLoading: boolean;
} => {
    const [cookies] = useCookies(['token', 'owner', 'repo']);
    const [body, setBody] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const location = useLocation();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    /// When users in the edit mode, fetching issue data.
    /// When users in the create mode, do nothing.
    useEffect(() => {
        const getContent = async () => {
            setIsLoading(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const data = await getIssue(id, cookies['token'], cookies['owner'], cookies['repo']);
            setTitle(data.title);
            setBody(data.body);
            setIsLoading(false);
        };
        if (location.pathname.includes('edit')) {
            getContent();
        }
    }, [id, cookies, location]);

    /// Navigating to issues page when users click the back button.
    const toPreviousPage = () => navigate('/issues');

    /// To updata issue data to database when users click the submit button.
    const updateIssue = async () => {
        if (title.length === 0) {
            toast.warning('請輸入標題');
            return;
        } else if (body.length < 30) {
            toast.warning('請輸入超過30字的內文');
            return;
        }
        if (location.pathname.includes('edit')) {
            await UpdateIssue(id, body, title, cookies['token'], cookies['owner'], cookies['repo'], navigate);
        } else if (location.pathname.includes('create')) {
            await createIssue(body, title, cookies['token'], cookies['owner'], cookies['repo'], navigate);
        }
    };

    return { body, setBody, title, setTitle, toPreviousPage, updateIssue, isLoading };
};