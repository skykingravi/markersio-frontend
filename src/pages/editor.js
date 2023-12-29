import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import PreLoader from "../components/preLoader.js";
import { useGetUserId } from "../hooks/useGetUserId.js";
import NotebookForm from "../components/notebookForm.js";
import Canvas from "./canvas.js";
import ShareLink from "../components/shareLink";
import { useCookies } from "react-cookie";
import { useGetURL } from "../hooks/useGetURL.js";
import { ReactComponent as AddVbIcon } from "../assets/icons/add-vb.svg";
import { ReactComponent as DownloadVbIcon } from "../assets/icons/download.svg";
import { ReactComponent as EditVbIcon } from "../assets/icons/edit.svg";
import { ReactComponent as ShareVbIcon } from "../assets/icons/share.svg";
import { ReactComponent as DeleteVbIcon } from "../assets/icons/delete.svg";

const Editor = () => {
    const [cookies] = useCookies(["access_token"]);
    const userId = useGetUserId();
    const [showPreLoader, setShowPreLoader] = useState(false);
    const [notebooksData, setnotebooksData] = useState([]);
    const [purpose, setPurpose] = useState("");
    const [val, setVal] = useState({});
    const [showNotebookForm, setShowNotebookForm] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);
    const [notebookDetails, setNotebookDetails] = useState({});
    const [pagesData, setPagesData] = useState([]);
    const [showShareLink, setShowShareLink] = useState(false);
    const [url, setUrl] = useState("");

    const [CLIENT_URL, SERVER_URL] = useGetURL();
    const NOTEBOOKS_LIMIT = 50;

    const fetchNotebooks = useCallback(async () => {
        try {
            setShowPreLoader(true);
            const response = await axios.get(
                `${SERVER_URL}/editor/notebooks/${userId}`,
                {
                    headers: {
                        Authorization: cookies.access_token,
                    },
                }
            );
            setnotebooksData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setShowPreLoader(false);
        }
    }, [userId, SERVER_URL, cookies.access_token]);

    useEffect(() => {
        fetchNotebooks();
    }, [fetchNotebooks]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleFullscreenToggle = () => {
        const element = document.documentElement;

        if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    };

    const handleAdd = () => {
        setPurpose("Add");
        setShowNotebookForm(true);
    };

    const getDataUrlImages = async (data) => {
        const imagesPromises = data.map(async (value) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const img = new Image();
                    img.src = value.pageContent;
                    img.onload = () => {
                        resolve({ width: img.width, height: img.height });
                    };
                } catch (error) {
                    reject(error);
                }
            });
        });

        return Promise.all(imagesPromises);
    };

    const handleDownload = async (e, id) => {
        e.stopPropagation();
        setShowPreLoader(true);
        try {
            const response = await axios.get(
                `${SERVER_URL}/editor/pages/${id}`,
                {
                    headers: {
                        Authorization: cookies.access_token,
                    },
                }
            );

            getDataUrlImages(response.data)
                .then((images) => {
                    const pdf = new jsPDF({
                        orientation:
                            images[0].width > images[0].height ? "l" : "p",
                        unit: "pt",
                        format: [images[0].width, images[0].height],
                    });
                    for (let i = 0; i < images.length; i++) {
                        pdf.addImage(
                            response.data[i].pageContent,
                            "PNG",
                            0,
                            0,
                            images[i].width,
                            images[i].height
                        );

                        if (i !== response.data.length - 1) {
                            pdf.addPage([
                                images[i + 1].width,
                                images[i + 1].height,
                            ]);
                        }
                    }
                    pdf.save("notebook.pdf");
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        } finally {
            setShowPreLoader(false);
        }
    };

    const handleEdit = (e, val) => {
        e.stopPropagation();
        setPurpose("Edit");
        setVal(val);
        setShowNotebookForm(true);
    };

    const handleShare = (e, id) => {
        e.stopPropagation();
        setUrl(`${CLIENT_URL}/share?notebook=${id}`);
        setShowShareLink(true);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            setShowPreLoader(true);
            const response = await axios.delete(
                `${SERVER_URL}/editor/notebooks/${userId}/${id}`,
                {
                    headers: {
                        Authorization: cookies.access_token,
                    },
                }
            );
            alert(response.data.message);
            fetchNotebooks();
        } catch (error) {
            console.error(error);
        } finally {
            setShowPreLoader(false);
        }
    };

    const handleClick = async (val) => {
        try {
            setShowPreLoader(true);
            setNotebookDetails(val);
            const response = await axios.get(
                `${SERVER_URL}/editor/pages/${val._id}`,
                {
                    headers: {
                        Authorization: cookies.access_token,
                    },
                }
            );
            setPagesData(response.data);
            handleFullscreenToggle();
            setShowCanvas(true);
        } catch (error) {
            console.error(error);
        } finally {
            setShowPreLoader(false);
        }
    };

    return (
        <>
            {showPreLoader && <PreLoader />}
            {showCanvas && (
                <Canvas
                    setShowCanvas={setShowCanvas}
                    notebookDetails={notebookDetails}
                    fetchNotebooks={fetchNotebooks}
                    pagesData={pagesData}
                    setNotebookDetails={setNotebookDetails}
                    setPagesData={setPagesData}
                />
            )}
            {showNotebookForm && (
                <NotebookForm
                    setShowPreLoader={setShowPreLoader}
                    setShowNotebookForm={setShowNotebookForm}
                    purpose={purpose}
                    fetchNotebooks={fetchNotebooks}
                    val={val}
                />
            )}
            <button
                onClick={() => handleAdd()}
                disabled={notebooksData.length === NOTEBOOKS_LIMIT}
                className="add-vb-btn"
            >
                <AddVbIcon className="add-vb-icon" />
            </button>
            <div className="virtual-notebooks">
                {notebooksData.length !== 0 ? (
                    notebooksData.map((val) => {
                        return (
                            <div
                                className="virtual-notebook"
                                key={val._id}
                                onClick={() => handleClick(val)}
                            >
                                <h2
                                    className="heading"
                                    title={val.notebookHeading}
                                >
                                    {val.notebookHeading}
                                </h2>
                                <hr color={val.notebookBackgroundColor} />
                                <h4
                                    className="description"
                                    title={val.notebookDescription}
                                >
                                    {val.notebookDescription}
                                </h4>
                                <h6 className="creation-details">
                                    {val.notebookCreationDetails}
                                </h6>
                                <div className="buttons">
                                    <button
                                        className="btn-icon"
                                        title="download"
                                        onClick={(e) =>
                                            handleDownload(e, val._id)
                                        }
                                    >
                                        <DownloadVbIcon className="icon" />
                                    </button>
                                    <button
                                        className="btn-icon"
                                        title="edit"
                                        onClick={(e) => handleEdit(e, val)}
                                    >
                                        <EditVbIcon className="icon" />
                                    </button>
                                    <button
                                        className="btn-icon"
                                        title="share"
                                        onClick={(e) => handleShare(e, val._id)}
                                    >
                                        <ShareVbIcon className="icon" />
                                    </button>
                                    <button
                                        className="btn-icon"
                                        title="delete"
                                        onClick={(e) =>
                                            handleDelete(e, val._id)
                                        }
                                    >
                                        <DeleteVbIcon className="icon" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty">
                        <h3>Empty</h3>
                        <p>Try adding one.</p>
                    </div>
                )}
            </div>
            {showShareLink && (
                <ShareLink url={url} setShowShareLink={setShowShareLink} />
            )}
        </>
    );
};

export default Editor;
