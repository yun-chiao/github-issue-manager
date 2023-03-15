
function ErrorFallback() {
    return (
        <div className="bg-sky-900 w-full h-screen flex justify-center items-center flex-col">
            <a href="/" className="h-12 w-32 border-2 text-white mb-4 hover:text-white flex items-center justify-center">To login page</a>
            <h1 className="text-white">Whoops, something went wrong.</h1>
        </div>
    );
}

export default ErrorFallback;
