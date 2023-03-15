import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    const toLogin = () => navigate('/');
    return (
        <div className="bg-sky-900 w-full h-screen flex justify-center items-center flex-col">
            <button className="h-12 w-32 border-2 text-white mb-4"
                    onClick={toLogin}>
                    To login page
            </button>
            <h1 className="text-white">404 Error</h1>
        </div>
    );
}

export default NotFound;
