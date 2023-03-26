import "@szhsin/react-menu/dist/transitions/slide.css"

import React from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";

/// The component to display Filter which can controll filter condition for fetching issues.
function Logout(): JSX.Element {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(["token", "owner", "repo", "username"]);

    // If the path is '/' or 'select', don't display this component.
    if (pathname === "/" || pathname === "/select") {
        return null;
    }

    const toSelectRepo = () => {
        navigate("/select");
    }

    const logout = () => {
        for (const cookieName in cookies) {
            try {
                removeCookie(cookieName as "token" | "owner" | "repo" | "username");
            } catch (error) {
                console.error(`Failed to remove cookie "${cookieName}": ${error}`);
            }
        }

        navigate("/");
    }

    return (
        <div className="w-30 h-30 fixed top-12 right-16 hidden text-white lg:block">
            <button className="my-2 h-10 w-full rounded-3xl bg-cyan-700" onClick={toSelectRepo}>Select repos</button>
            <button className="my-2 h-10 w-full rounded-3xl bg-cyan-700" onClick={logout}>Logout</button>
        </div>
    );
}

export default Logout;

