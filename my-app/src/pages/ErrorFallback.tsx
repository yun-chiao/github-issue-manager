import React from "react";

function ErrorFallback(): JSX.Element {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-sky-900">
            <a href="/" className="mb-4 flex h-12 w-32 items-center justify-center border-2 text-white hover:text-white">To login page</a>
            <h1 className="text-white">Whoops, something went wrong.</h1>
        </div>
    );
}

export default ErrorFallback;
