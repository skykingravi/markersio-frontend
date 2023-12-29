import React, { useState } from "react";
import PreLoader from "./preLoader";
import { ReactComponent as MailIcon } from "../assets/icons/mail.svg";
import axios from "axios";
import { useGetURL } from "../hooks/useGetURL";

const JoinInput = () => {
    const [showPreLoader, setShowPreLoader] = useState(false);
    const [email, setEmail] = useState("");
    const [isDisable, setIsDisable] = useState(false);

    const [, SERVER_URL] = useGetURL();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowPreLoader(true);
        setIsDisable(true);
        try {
            await axios.post(`${SERVER_URL}/contact/join`, {
                joinEmail: email,
            });
            // alert(response.data.message);
            setEmail("");
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setIsDisable(false);
            }, 2000);
            setShowPreLoader(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label className="content-data" htmlFor="join-input">
                    To be updated with our latest news.
                </label>
                <div className="join-input-wrapper">
                    <input
                        spellCheck="false"
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        name="join-input"
                        id="join-input"
                        required
                        placeholder="Enter your email address"
                    />
                    <button
                        title="Click to Join!"
                        disabled={isDisable}
                        type="submit"
                    >
                        <MailIcon className="join-icon" />
                    </button>
                </div>
            </form>
            {showPreLoader && <PreLoader />}
        </>
    );
};

export default JoinInput;
