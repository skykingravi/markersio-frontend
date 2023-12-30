import "./styles/main.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Home } from "./pages/home.js";
import { Auth } from "./pages/auth.js";
import { Navbar } from "./components/navbar.js";
import Editor from "./pages/editor.js";
import Contact from "./pages/contact.js";
import NotFound from "./pages/notFound.js";
import { useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Share from "./pages/share.js";
import Guide from "./pages/guide.js";

function App() {
    const [cookies, setCookies] = useCookies(["access_token"]);

    const checkTokenExpiry = useCallback(
        (value) => {
            try {
                if (jwtDecode(value).exp * 1000 <= Date.now()) {
                    setCookies("access_token", "");
                    window.localStorage.removeItem("token");
                    window.localStorage.removeItem("userID");
                } else {
                    setCookies("access_token", value);
                    window.localStorage.setItem("token", value);
                }
            } catch (error) {
                console.error(error);
            }
        },
        [setCookies]
    );

    useEffect(() => {
        if (cookies.access_token) {
            checkTokenExpiry(cookies.access_token);
        } else if (window.localStorage.getItem("token")) {
            checkTokenExpiry(window.localStorage.getItem("token"));
        }
    }, [checkTokenExpiry, cookies.access_token]);

    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {cookies.access_token && (
                        <Route path="/editor" element={<Editor />} />
                    )}
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/contact" element={<Contact />} />
                    {!cookies.access_token && (
                        <Route path="/auth" element={<Auth />} />
                    )}
                    <Route path="/share" element={<Share />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
