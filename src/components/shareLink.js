import React, { useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";

const ShareLink = ({ url, setShowShareLink }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };

    return (
        <section className="share-link">
            <div className="share-link-container">
                <button
                    className="hide-btn btn-icon"
                    type="button"
                    onClick={() => setShowShareLink(false)}
                >
                    <CloseIcon className="icon close-icon" />
                </button>
                <h1>Share Notebook</h1>
                <div>
                    <label htmlFor="url">
                        Anyone with this URL will be able to view the shared
                        virtual notebook.
                    </label>
                    <br />
                    <input
                        name="url"
                        id="url"
                        readOnly={true}
                        type="text"
                        value={url}
                    />
                    <a href={url} target="_blank" rel="noreferrer">
                        Open Link
                    </a>
                </div>
                <button className="btn" onClick={handleCopy} disabled={copied}>
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
            </div>
        </section>
    );
};

export default ShareLink;
