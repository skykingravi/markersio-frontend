import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Guide = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <ul className="guide-list">
            <li className="guide-item">
                <h3>
                    Make sure to create an account (if not already).
                    <span
                        title="link"
                        className="guide-link"
                        onClick={() => navigate("/auth")}
                    >
                        🔗
                    </span>
                </h3>
                <p>
                    Before diving into the wealth of features MarkersIO offers,
                    make sure to sign in or register to access your personalised
                    digital workspace.
                </p>
            </li>
            <li className="guide-item">
                <h3>
                    Create your first virtual notebook.
                    <span
                        title="link"
                        className="guide-link"
                        onClick={() => navigate("/editor")}
                    >
                        🔗
                    </span>
                </h3>
                <ul className="guide-sub-list">
                    <li>
                        Click on the “+” button (located at the right-bottom
                        corner).
                    </li>
                    <li>
                        Type the name & description and choose a background
                        colour.
                    </li>
                    <li>Hit the “Add” button.</li>
                </ul>
            </li>
            <li className="guide-item">
                <h3>Explore the canvas window.</h3>
                <ul className="guide-sub-list">
                    <li>
                        Click on any virtual notebook that you want to open.
                    </li>
                    <li>
                        Now you can draw/write your thoughts with free-hand and
                        access all tools.
                    </li>
                </ul>
                <p className="guide-tip">
                    <span>Tip</span> - Click on the “Current-Page” (located at
                    the top-left corner) to hide/view the toolbar.
                </p>
            </li>
            <li className="guide-item">
                <h3>Tools.</h3>
                <ul className="guide-sub-list">
                    <li>Marker - to draw or write on the current page.</li>
                    <li>
                        Eraser - to remove unwanted marks or content from the
                        current page.
                    </li>
                    <li>
                        Colour - to choose a preferred colour for your drawings
                        or notes. You can also add a colour by pressing “+” and
                        delete colours by double clicking them.
                    </li>
                    <li>
                        Stroke - to customise the thickness of marker/eraser.
                    </li>
                    <li>Undo - to undo the actions performed.</li>
                    <li>Redo - to redo the actions performed.</li>
                    <li>Save - to save the changes made.</li>
                    <li>
                        Clear - to remove all content from the current page.
                    </li>
                    <li>
                        Home - to quickly navigate back to the main list of
                        virtual notebooks.
                    </li>
                    <li>Previous - to move to the previous page.</li>
                    <li>Next - to move to the next page.</li>
                    <li>Add - to insert a new page.</li>
                    <li>
                        Download - to download the current page as a PNG file.
                    </li>
                    <li>Delete - to delete the current page.</li>
                </ul>
                <p className="guide-tip">
                    <span>Tip</span> - Always save the progress before exiting.
                </p>
            </li>
            <li className="guide-item">
                <h3>
                    Operations on virtual notebooks.
                    <span
                        title="link"
                        className="guide-link"
                        onClick={() => navigate("/editor")}
                    >
                        🔗
                    </span>
                </h3>
                <ul className="guide-sub-list">
                    <li>
                        Download - to download a virtual notebook in PDF format.
                    </li>
                    <li>
                        Edit - to edit the name, description and background
                        colour of a virtual notebook.
                    </li>
                    <li>
                        Share - to share a link that lets others to view your
                        virtual notebook.
                    </li>
                    <li>Delete - to delete a virtual notebook.</li>
                </ul>
                <p className="guide-tip">
                    <span>Tip</span> - Use a wider screen for better experience.
                </p>
            </li>
            <li className="guide-item">
                <h3>
                    Fix bugs and enhance features.
                    <span>
                        <a
                            title="link"
                            className="guide-link"
                            href="https://github.com/skykingravi"
                            target="_blank"
                            rel="noreferrer"
                        >
                            🔗
                        </a>
                    </span>
                </h3>
                <p>
                    Contribute directly by fixing bugs or enhancing features.
                    Make changes in your forked branch and submit a pull request
                    to have your modifications considered for inclusion. Connect
                    with other contributors and the MarkersIO community on
                    GitHub. Engage in discussions, share ideas, and collaborate
                    to make MarkersIO even better.
                </p>
            </li>
        </ul>
    );
};

export default Guide;
