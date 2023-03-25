import { useEffect,useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation,useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { createIssue, getIssue, UpdateIssue } from "../service";

export const useSingleIssue = (): {
    body: string;
    setBody: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    toPreviousPage: () => void;
    updateIssue: () => Promise<void>;
    isLoading: boolean;
} => {
    const [cookies] = useCookies(["token", "owner", "repo"]);
    const [body, setBody] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const location = useLocation();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    /// When users in the edit mode, fetching issue data.
    /// When users in the create mode, do nothing.
    useEffect(() => {
        window.scrollTo({
 top: 0, behavior: "smooth" 
});

        const getContent = async () => {
            setIsLoading(true);
            const data = await getIssue(id, cookies["token"], cookies["owner"], cookies["repo"]);
            setTitle(data.title);
            setBody(data.body);
            setIsLoading(false);
        };

        if (location.pathname.includes("edit")) {
            getContent();
        }
    }, [id, cookies, location]);

    /// Navigating to issues page when users click the back button.
    const toPreviousPage = () => navigate("/issues");

    /// To updata issue data to database when users click the submit button.
    const updateIssue = async () => {
        if (title.length === 0) {
            toast.warning("請輸入標題");
            return;
        } else if (body.length < 30) {
            toast.warning("請輸入超過30字的內文");
            return;
        }

        setIsLoading(true);

        if (location.pathname.includes("edit")) {
            await UpdateIssue(id, body, title, cookies["token"], cookies["owner"], cookies["repo"]);
        } else if (location.pathname.includes("create")) {
            await createIssue(body, title, cookies["token"], cookies["owner"], cookies["repo"]);
        }

        // To avoid the issue not be updated when the issue list get issues data.
        setTimeout(() => {
            navigate("/issues");
            setIsLoading(false);
        }, 1000);
    };

    return {
 body, setBody, title, setTitle, toPreviousPage, updateIssue, isLoading 
};
};