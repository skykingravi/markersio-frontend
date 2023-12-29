import React, { useCallback, useEffect, useRef, useState } from "react";
import PreLoader from "../components/preLoader";
import axios from "axios";
import { useGetUserId } from "../hooks/useGetUserId";
import { useBuffer } from "../hooks/useBuffer";
import { useCookies } from "react-cookie";
import { useGetURL } from "../hooks/useGetURL";
import { useColorChecker } from "../hooks/useColorChecker.js";

import { ReactComponent as MarkerIcon } from "../assets/icons/marker.svg";
import { ReactComponent as EraserIcon } from "../assets/icons/eraser.svg";
import { ReactComponent as ColorIcon } from "../assets/icons/color.svg";
import { ReactComponent as StrokeIcon } from "../assets/icons/stroke.svg";
import { ReactComponent as UndoIcon } from "../assets/icons/undo.svg";
import { ReactComponent as RedoIcon } from "../assets/icons/redo.svg";
import { ReactComponent as SaveIcon } from "../assets/icons/save.svg";
import { ReactComponent as ClearIcon } from "../assets/icons/clear.svg";
import { ReactComponent as HomeIcon } from "../assets/icons/home.svg";
import { ReactComponent as PreviousIcon } from "../assets/icons/previous.svg";
import { ReactComponent as NextIcon } from "../assets/icons/next.svg";
import { ReactComponent as AddIcon } from "../assets/icons/add.svg";
import { ReactComponent as DownloadIcon } from "../assets/icons/download.svg";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";
import { ReactComponent as AddColorIcon } from "../assets/icons/add-color.svg";
import { ReactComponent as CheckIcon } from "../assets/icons/check.svg";

const Canvas = ({
    setShowCanvas,
    notebookDetails,
    fetchNotebooks,
    pagesData,
    setNotebookDetails,
    setPagesData,
}) => {
    const [cookies] = useCookies(["access_token"]);

    const [showPreLoader, setShowPreLoader] = useState(false);
    const [showTools, setShowTools] = useState(true);
    const [showAddColor, setShowAddColor] = useState(false);
    const [newColor, setNewColor] = useState("#000000");
    const [currentTool, setCurrentTool] = useState("marker");
    const [currentMainTool, setCurrentMainTool] = useState("marker");

    const isColorDark = useColorChecker();

    const [undo, undoPush, undoPop, undoClear] = useBuffer(10);
    const [redo, redoPush, redoPop, redoClear] = useBuffer(10);

    const userId = useGetUserId();
    const [, SERVER_URL] = useGetURL();
    const canvasRef = useRef(null);
    const markerButtonRef = useRef(null);
    const eraserButtonRef = useRef(null);
    const cursorRef = useRef(null);
    const PAGES_LIMIT = 20;

    const init = useCallback(() => {
        undoClear();
        redoClear();
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        context.lineWidth = notebookDetails.notebookStrokeSize;
        context.lineCap = "round";
        context.strokeStyle =
            notebookDetails.notebookColors[
                notebookDetails.notebookCurrentColor - 1
            ];
        context.fillStyle = notebookDetails.notebookBackgroundColor;

        context.fillRect(0, 0, canvas.width, canvas.height);

        const tempImage = new Image();
        tempImage.onload = () => {
            context.drawImage(tempImage, 0, 0);
            undoPush(canvas.toDataURL());
        };
        tempImage.src =
            pagesData[notebookDetails.notebookCurrentPageNo - 1].pageContent;

        let isDrawing = false,
            resizeTimeout,
            lastX = 0,
            lastY = 0,
            mouseX = 0,
            mouseY = 0;
        const X = canvas.getBoundingClientRect().left;
        const Y = canvas.getBoundingClientRect().top;

        const startDrawing = (e) => {
            setCurrentTool(currentMainTool);
            isDrawing = true;
            [lastX, lastY] = [e.offsetX - X, e.offsetY - Y];
            draw(e);
        };

        const draw = (e) => {
            mouseX = e.offsetX - X;
            mouseY = e.offsetY - Y;
            if (cursorRef.current) {
                cursorRef.current.style.left = `${mouseX}px`;
                cursorRef.current.style.top = `${mouseY}px`;
            }
            if (canvasRef.current) {
                canvasRef.current.style.cursor = "none !important";
            }
            if (!isDrawing) return;
            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(mouseX, mouseY);
            context.stroke();
            [lastX, lastY] = [mouseX, mouseY];
        };

        const stopDrawing = (e) => {
            isDrawing = false;
            if (cursorRef.current && e.type === "mouseleave") {
                cursorRef.current.style.setProperty("display", "none");
            }
            if (e.type !== "mouseleave") {
                undoPush(canvas.toDataURL());
                redoClear();
            }
        };

        const handleResizing = () => {
            if (!canvasRef.current) return;
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(init, 500);
        };

        const handleEnter = () => {
            if (cursorRef.current) {
                cursorRef.current.style.setProperty("display", "initial");
            }
        };

        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stopDrawing);
        canvas.removeEventListener("mouseleave", stopDrawing);
        canvas.removeEventListener("mouseenter", handleEnter);
        window.removeEventListener("resize", handleResizing);

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mouseleave", stopDrawing);
        canvas.addEventListener("mouseenter", handleEnter);
        window.addEventListener("resize", handleResizing);

        return () => {
            canvas.removeEventListener("mousedown", startDrawing);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", stopDrawing);
            canvas.removeEventListener("mouseleave", stopDrawing);
            canvas.removeEventListener("mouseenter", handleEnter);
            window.removeEventListener("resize", handleResizing);
        };
    }, []);

    useEffect(() => {
        setShowPreLoader(true);
        init();
        setTimeout(() => {
            setShowPreLoader(false);
        }, 2000);
    }, [init]);

    const fetchPages = async () => {
        try {
            setShowPreLoader(true);
            const response = await axios.get(
                `${SERVER_URL}/editor/pages/${notebookDetails._id}`,
                {
                    headers: {
                        Authorization: cookies.access_token,
                    },
                }
            );
            setPagesData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setShowPreLoader(false);
            }, 2000);
        }
    };

    const fetchNotebookDetails = async () => {
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
            response.data.forEach((val) => {
                if (val._id === notebookDetails._id) {
                    setNotebookDetails(val);
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setShowPreLoader(false);
            }, 2000);
        }
    };

    const drawContentOnCanvas = (content) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const tempImage = new Image();
        tempImage.onload = () => {
            context.drawImage(tempImage, 0, 0);
        };
        tempImage.src = content;
    };

    const handleMarker = () => {
        setCurrentTool("marker");
        setCurrentMainTool("marker");
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle =
            notebookDetails.notebookColors[
                notebookDetails.notebookCurrentColor - 1
            ];
    };

    const handleEraser = () => {
        setCurrentTool("eraser");
        setCurrentMainTool("eraser");
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle = notebookDetails.notebookBackgroundColor;
    };

    const handleColor = (val, indx) => {
        setShowAddColor(false);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle = val;
        setNotebookDetails({
            ...notebookDetails,
            notebookCurrentColor: indx + 1,
        });
        setCurrentMainTool("marker");
    };

    const handleColorDelete = (val, indx) => {
        if (notebookDetails.notebookColors.length === 1) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle =
            notebookDetails.notebookColors[
                indx === notebookDetails.notebookColors.length - 1
                    ? indx
                    : indx + 1
            ];

        setNotebookDetails({
            ...notebookDetails,
            notebookCurrentColor:
                indx === notebookDetails.notebookColors.length - 1
                    ? indx
                    : indx + 1,
            notebookColors: notebookDetails.notebookColors.filter(
                (value) => value !== val
            ),
        });
    };

    const handleAddColor = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle = newColor;
        if (showAddColor) {
            if (notebookDetails.notebookColors.includes(newColor) === false) {
                setNotebookDetails({
                    ...notebookDetails,
                    notebookCurrentColor:
                        notebookDetails.notebookColors.length + 1,
                    notebookColors: [
                        ...notebookDetails.notebookColors,
                        newColor,
                    ],
                });
            } else {
                notebookDetails.notebookColors.indexOf(newColor);
                setNotebookDetails({
                    ...notebookDetails,
                    notebookCurrentColor:
                        notebookDetails.notebookColors.indexOf(newColor) + 1,
                });
            }
            setNewColor("#000000");
            setCurrentMainTool("marker");
        }
        setShowAddColor((prev) => !prev);
    };

    const handleStroke = (e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.lineWidth = e.target.value;
        setNotebookDetails({
            ...notebookDetails,
            notebookStrokeSize: e.target.value,
        });
    };

    const handleUndo = () => {
        if (undo.length <= 1) return;
        redoPush(undo[undo.length - 1]);
        drawContentOnCanvas(undo[undo.length - 2]);
        undoPop();
    };

    const handleRedo = () => {
        if (redo.length <= 0) return;
        undoPush(redo[redo.length - 1]);
        drawContentOnCanvas(redo[redo.length - 1]);
        redoPop();
    };

    const handleHome = () => {
        fetchNotebooks();
        setShowCanvas(false);
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const handleSave = async () => {
        pagesData.forEach(async (val) => {
            try {
                setShowPreLoader(true);
                const content =
                    val._id ===
                    notebookDetails.createdPages[
                        notebookDetails.notebookCurrentPageNo - 1
                    ]
                        ? canvasRef.current.toDataURL()
                        : val.pageContent;
                await axios.put(
                    `${SERVER_URL}/editor/pages/${val._id}`,
                    {
                        pageContent: content,
                    },
                    {
                        headers: {
                            Authorization: cookies.access_token,
                        },
                    }
                );
            } catch (error) {
                console.error(error);
            } finally {
                setTimeout(() => {
                    setShowPreLoader(false);
                }, 2000);
            }
        });
        try {
            setShowPreLoader(true);
            await axios.put(`${SERVER_URL}/editor/notebooks`, notebookDetails, {
                headers: {
                    Authorization: cookies.access_token,
                },
            });
            fetchPages();
            fetchNotebookDetails();
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setShowPreLoader(false);
            }, 2000);
        }
    };

    const handleClear = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillRect(0, 0, canvas.width, canvas.height);
        undoPush(canvas.toDataURL());
        redoClear();
    };

    const saveCurrentPage = () => {
        const canvas = canvasRef.current;

        let newArray = [...pagesData];
        newArray[notebookDetails.notebookCurrentPageNo - 1].pageContent =
            canvas.toDataURL();

        setPagesData(newArray);
    };

    const handlePrev = () => {
        if (notebookDetails.notebookCurrentPageNo === 1 || !canvasRef.current)
            return;

        saveCurrentPage();

        setNotebookDetails((prevNotebookDetails) => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.fillRect(0, 0, canvas.width, canvas.height);
            drawContentOnCanvas(
                pagesData[prevNotebookDetails.notebookCurrentPageNo - 2]
                    .pageContent
            );
            return {
                ...prevNotebookDetails,
                notebookCurrentPageNo:
                    prevNotebookDetails.notebookCurrentPageNo - 1,
            };
        });
        undoClear();
        redoClear();
        undoPush(
            pagesData[notebookDetails.notebookCurrentPageNo - 2].pageContent
        );
    };

    const handleNext = () => {
        if (
            notebookDetails.notebookCurrentPageNo ===
                notebookDetails.createdPages.length ||
            !canvasRef.current
        )
            return;

        saveCurrentPage();

        setNotebookDetails((prevNotebookDetails) => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.fillRect(0, 0, canvas.width, canvas.height);
            drawContentOnCanvas(
                pagesData[prevNotebookDetails.notebookCurrentPageNo].pageContent
            );
            return {
                ...prevNotebookDetails,
                notebookCurrentPageNo:
                    prevNotebookDetails.notebookCurrentPageNo + 1,
            };
        });
        undoClear();
        redoClear();
        undoPush(pagesData[notebookDetails.notebookCurrentPageNo].pageContent);
    };

    const handleAdd = async () => {
        if (
            notebookDetails.createdPages.length === PAGES_LIMIT ||
            !canvasRef.current
        )
            return;
        saveCurrentPage();
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillRect(0, 0, canvas.width, canvas.height);
        try {
            setShowPreLoader(true);
            const response = await axios.post(
                `${SERVER_URL}/editor/pages`,
                {
                    pageContent: canvas.toDataURL(),
                    notebookId: notebookDetails._id,
                },
                {
                    headers: {
                        Authorization: cookies.access_token,
                    },
                }
            );

            if (response.data.pageId) {
                let newArray = [...pagesData];
                newArray.push({
                    _id: response.data.pageId,
                    pageContent: canvas.toDataURL(),
                });

                setPagesData(newArray);

                setNotebookDetails((prevNotebookDetails) => {
                    return {
                        ...prevNotebookDetails,
                        notebookCurrentPageNo:
                            prevNotebookDetails.createdPages.length + 1,
                        createdPages: [
                            ...prevNotebookDetails.createdPages,
                            response.data.pageId,
                        ],
                    };
                });
                undoClear();
                redoClear();
                undoPush(canvas.toDataURL());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setShowPreLoader(false);
            }, 2000);
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL();

        const link = document.createElement("a");
        link.href = dataURL;
        link.setAttribute(
            "download",
            `page_${notebookDetails.notebookCurrentPageNo}.png`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async () => {
        if (notebookDetails.createdPages.length === 1 || !canvasRef.current)
            return;
        try {
            setShowPreLoader(true);
            await axios.delete(
                `${SERVER_URL}/editor/pages/${notebookDetails._id}/${
                    pagesData[notebookDetails.notebookCurrentPageNo - 1]._id
                }`,
                {
                    headers: {
                        Authorization: cookies.access_token,
                    },
                }
            );
            await fetchPages();
            await fetchNotebookDetails();
            undoClear();
            redoClear();
            if (
                notebookDetails.notebookCurrentPageNo ===
                notebookDetails.createdPages.length
            ) {
                drawContentOnCanvas(
                    pagesData[notebookDetails.notebookCurrentPageNo - 2]
                        .pageContent
                );
                undoPush(
                    pagesData[notebookDetails.notebookCurrentPageNo - 2]
                        .pageContent
                );
            } else {
                drawContentOnCanvas(
                    pagesData[notebookDetails.notebookCurrentPageNo - 1]
                        .pageContent
                );
                undoPush(
                    pagesData[notebookDetails.notebookCurrentPageNo - 1]
                        .pageContent
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setShowPreLoader(false);
            }, 2000);
        }
    };

    return (
        <div
            className="canvas-container"
            style={{
                "--btn-theme1": `${
                    isColorDark(notebookDetails.notebookBackgroundColor)
                        ? "#f0f0f0"
                        : "#0f0f0f"
                }`,
                "--btn-theme2": `${
                    isColorDark(notebookDetails.notebookBackgroundColor)
                        ? "#0f0f0f"
                        : "#f0f0f0"
                }`,
                "--btn-theme3": `${
                    isColorDark(notebookDetails.notebookBackgroundColor)
                        ? "#f0f0f090"
                        : "#0f0f0f90"
                }`,
            }}
        >
            <canvas
                style={{
                    backgroundColor: notebookDetails.notebookBackgroundColor,
                }}
                ref={canvasRef}
                id="canvas"
            ></canvas>
            <div
                id="cursor"
                ref={cursorRef}
                style={{
                    backgroundColor: `${
                        currentMainTool === "marker"
                            ? notebookDetails.notebookColors[
                                  notebookDetails.notebookCurrentColor - 1
                              ]
                            : notebookDetails.notebookBackgroundColor
                    }`,
                    borderColor: `${
                        isColorDark(
                            currentMainTool === "marker"
                                ? notebookDetails.notebookColors[
                                      notebookDetails.notebookCurrentColor - 1
                                  ]
                                : notebookDetails.notebookBackgroundColor
                        )
                            ? "#f0f0f0"
                            : "#0f0f0f"
                    }`,
                    width: `${notebookDetails.notebookStrokeSize}px`,
                    height: `${notebookDetails.notebookStrokeSize}px`,
                }}
            ></div>
            <div
                className="current-page-no"
                onClick={() => {
                    setCurrentTool(currentMainTool);
                    setShowTools((prevState) => !prevState);
                }}
                title={showTools ? "Hide Toolbar" : "Show Toolbar"}
            >
                {notebookDetails.notebookCurrentPageNo}
            </div>
            <div
                className={`btns-container${showTools ? "" : " hidden"}`}
                style={{
                    "--btn-hover": notebookDetails.notebookBackgroundColor,
                    "--btn-disable": `${
                        isColorDark(notebookDetails.notebookBackgroundColor)
                            ? "#f0f0f040"
                            : "#0f0f0f40"
                    }`,
                }}
            >
                <button
                    ref={markerButtonRef}
                    onClick={() => handleMarker()}
                    className={
                        "btn-icon" +
                        (currentMainTool === "marker" ? " selected" : "")
                    }
                >
                    <MarkerIcon className="icon" />
                </button>
                <button
                    ref={eraserButtonRef}
                    onClick={() => handleEraser()}
                    className={
                        "btn-icon" +
                        (currentMainTool === "eraser" ? " selected" : "")
                    }
                >
                    <EraserIcon className="icon" />
                </button>
                <button
                    className={
                        "btn-icon" +
                        (currentTool === "color" ? " selected" : "")
                    }
                    onClick={() => {
                        setCurrentTool((prev) =>
                            prev === "color" ? currentMainTool : "color"
                        );
                    }}
                >
                    <ColorIcon className="icon" />
                </button>
                <button
                    className={
                        "btn-icon" +
                        (currentTool === "stroke" ? " selected" : "")
                    }
                    onClick={() => {
                        setCurrentTool((prev) =>
                            prev === "stroke" ? currentMainTool : "stroke"
                        );
                    }}
                >
                    <StrokeIcon className="icon" />
                </button>
                <button
                    className="btn-icon"
                    onClick={() => handleUndo()}
                    disabled={undo.length <= 1}
                >
                    <UndoIcon className="icon" />
                </button>
                <button
                    className="btn-icon"
                    onClick={() => handleRedo()}
                    disabled={redo.length <= 0}
                >
                    <RedoIcon className="icon" />
                </button>
                <button className="btn-icon" onClick={() => handleSave()}>
                    <SaveIcon className="icon" />
                </button>
                <button className="btn-icon" onClick={() => handleClear()}>
                    <ClearIcon className="icon" />
                </button>
                <button
                    className="btn-icon"
                    type="button"
                    onClick={() => handleHome()}
                >
                    <HomeIcon className="icon" />
                </button>
                <button
                    className="btn-icon"
                    onClick={() => handlePrev()}
                    disabled={notebookDetails.notebookCurrentPageNo === 1}
                >
                    <PreviousIcon className="icon" />
                </button>
                <button
                    className="btn-icon"
                    onClick={() => handleNext()}
                    disabled={
                        notebookDetails.notebookCurrentPageNo ===
                        notebookDetails.createdPages.length
                    }
                >
                    <NextIcon className="icon" />
                </button>
                <button
                    className="btn-icon"
                    onClick={() => handleAdd()}
                    disabled={
                        notebookDetails.createdPages.length === PAGES_LIMIT
                    }
                >
                    <AddIcon />
                </button>
                <button className="btn-icon" onClick={() => handleDownload()}>
                    <DownloadIcon className="icon" />
                </button>
                <button
                    className="btn-icon"
                    onClick={() => handleDelete()}
                    disabled={notebookDetails.createdPages.length === 1}
                >
                    <DeleteIcon className="icon" />
                </button>

                {currentTool === "stroke" && (
                    <div
                        className="stroke-wrapper"
                        style={{
                            "--input-theme":
                                notebookDetails.notebookBackgroundColor,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor:
                                    currentMainTool === "marker"
                                        ? notebookDetails.notebookColors[
                                              notebookDetails.notebookCurrentColor -
                                                  1
                                          ]
                                        : notebookDetails.notebookBackgroundColor,
                                borderColor: `${
                                    isColorDark(
                                        currentMainTool === "marker"
                                            ? notebookDetails.notebookColors[
                                                  notebookDetails.notebookCurrentColor -
                                                      1
                                              ]
                                            : notebookDetails.notebookBackgroundColor
                                    )
                                        ? "#f0f0f0"
                                        : "#0f0f0f"
                                }`,
                                width: `${notebookDetails.notebookStrokeSize}px`,
                                height: `${notebookDetails.notebookStrokeSize}px`,
                            }}
                        ></div>
                        <input
                            className="stroke-input"
                            type="range"
                            min={1}
                            max={100}
                            step={1}
                            value={notebookDetails.notebookStrokeSize}
                            onChange={handleStroke}
                        />
                        <button
                            className="btn-icon"
                            onClick={() => setCurrentTool(currentMainTool)}
                        >
                            <CheckIcon className="icon" />
                        </button>
                    </div>
                )}
                {currentTool === "color" && (
                    <div className="color-wrapper">
                        <div className="add-color-container">
                            <label
                                style={{
                                    backgroundColor: `${newColor}`,
                                    "--add-icon-clr": `${
                                        isColorDark(newColor)
                                            ? "#f0f0f0"
                                            : "#0f0f0f"
                                    }`,
                                }}
                                htmlFor="add-color"
                                onClick={() => handleAddColor()}
                            >
                                {showAddColor ? (
                                    <CheckIcon />
                                ) : (
                                    <AddColorIcon />
                                )}
                            </label>
                            {showAddColor && (
                                <input
                                    type="color"
                                    id="add-color"
                                    name="add-color"
                                    value={newColor}
                                    onChange={(e) =>
                                        setNewColor(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                />
                            )}
                        </div>
                        {notebookDetails.notebookColors.map((val, indx) => {
                            return (
                                <div
                                    key={`color-${indx + 1}`}
                                    style={{
                                        "--clr-val": val,
                                    }}
                                    className={
                                        notebookDetails.notebookColors[
                                            notebookDetails.notebookCurrentColor -
                                                1
                                        ] === val
                                            ? "color selected"
                                            : "color"
                                    }
                                    onClick={() => handleColor(val, indx)}
                                    onDoubleClick={() =>
                                        handleColorDelete(val, indx)
                                    }
                                ></div>
                            );
                        })}
                    </div>
                )}
            </div>
            {showPreLoader && <PreLoader />}
        </div>
    );
};

export default Canvas;
