import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";
import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";
import Button from "./button";

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const [showNavbar, setShowNavbar] = useState(false);

    const location = useLocation();

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--clr1",
            location.pathname === "/" || location.pathname === "/auth"
                ? "#f0f0f0"
                : "#0f0f0f"
        );
        document.documentElement.style.setProperty(
            "--clr2",
            location.pathname === "/" || location.pathname === "/auth"
                ? "#0f0f0f"
                : "#f0f0f0"
        );
    }, [location.pathname]);

    const logOut = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userID");
        navigate("/auth");
    };

    return (
        <header>
            <nav className={showNavbar ? "navbar" : "navbar hidden"}>
                <div className="header-wrapper">
                    <Link
                        onClick={() => window.scrollTo(0, 0)}
                        to="/"
                        className="logo-wrapper"
                    >
                        <LogoIcon id="logo" />
                    </Link>
                    <button
                        onClick={() => setShowNavbar((prevState) => !prevState)}
                    >
                        <MenuIcon className="menu-icon" />
                    </button>
                </div>
                <ul>
                    <li
                        onClick={() => {
                            setShowNavbar(false);
                            window.scrollTo(0, 0);
                        }}
                        className={location.pathname === "/" ? "selected" : ""}
                    >
                        <Link to="/">HOME</Link>
                    </li>
                    {cookies.access_token && (
                        <li
                            onClick={() => setShowNavbar(false)}
                            className={
                                location.pathname === "/editor"
                                    ? "selected"
                                    : ""
                            }
                        >
                            <Link to="/editor">EDITOR</Link>
                        </li>
                    )}
                    <li
                        onClick={() => setShowNavbar(false)}
                        className={
                            location.pathname === "/guide" ? "selected" : ""
                        }
                    >
                        <Link to="/guide">GUIDE</Link>
                    </li>
                    <li
                        onClick={() => setShowNavbar(false)}
                        className={
                            location.pathname === "/contact" ? "selected" : ""
                        }
                    >
                        <Link to="/contact">CONTACT</Link>
                    </li>
                </ul>
                {cookies.access_token ? (
                    <Button
                        handleButtonClick={() => {
                            setShowNavbar(false);
                            logOut();
                        }}
                        name="LOG OUT"
                    />
                ) : (
                    <Link onClick={() => setShowNavbar(false)} to="/auth">
                        <Button name="SIGN UP" />
                    </Link>
                )}
            </nav>
        </header>
    );
};
