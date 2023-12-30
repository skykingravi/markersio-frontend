import { React, useState } from "react";
import { useGetUserId } from "../hooks/useGetUserId";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetURL } from "../hooks/useGetURL";
import Button from "./button.js";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";

const NotebookForm = ({
    setShowPreLoader,
    setShowNotebookForm,
    purpose,
    val,
    fetchNotebooks,
}) => {
    const [cookies] = useCookies(["access_token"]);
    const [, SERVER_URL] = useGetURL();
    const userId = useGetUserId();
    const [notebook, setNotebook] = useState({
        notebookHeading: purpose === "Edit" ? val.notebookHeading : "",
        notebookDescription: purpose === "Edit" ? val.notebookDescription : "",
        notebookBackgroundColor:
            purpose === "Edit" ? val.notebookBackgroundColor : "#000000",
    });
    const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const getCurrentDateTime = () => {
        const dt = new Date();
        return `${dt.getHours().toString(10).padStart(2, "0")}:${dt
            .getMinutes()
            .toString(10)
            .padStart(2, "0")} | ${
            MONTHS[dt.getMonth()]
        } ${dt.getDate()}, ${dt.getFullYear()}`;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNotebook({
            ...notebook,
            [name]:
                name === "notebookBackgroundColor"
                    ? value.toUpperCase()
                    : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowPreLoader(true);
        if (purpose === "Add") {
            try {
                const response = await axios.post(
                    `${SERVER_URL}/editor/notebooks`,
                    {
                        data: {
                            notebookHeading: notebook.notebookHeading,
                            notebookDescription: notebook.notebookDescription,
                            notebookCreationDetails: getCurrentDateTime(),
                            notebookBackgroundColor:
                                notebook.notebookBackgroundColor.toUpperCase(),
                            notebookColors: [
                                "#7768E4",
                                "#3985F4",
                                "#5EB553",
                                "#F4C01F",
                                "#EC5E3C",
                                "#E6445A",
                            ],
                            notebookCurrentColor: 1,
                            notebookCurrentPageNo: 1,
                            notebookStrokeSize: 20,
                            createdPages: [],
                        },
                        userId,
                    },
                    {
                        headers: {
                            Authorization: cookies.access_token,
                        },
                    }
                );
                // alert(response.data.message);

                if (response.data.notebookId) {
                    const canvasElement = document.createElement("canvas");
                    canvasElement.width = window.innerWidth;
                    canvasElement.height = window.innerHeight;
                    const ctx = canvasElement.getContext("2d");
                    ctx.fillStyle = notebook.notebookBackgroundColor;
                    ctx.fillRect(
                        0,
                        0,
                        canvasElement.width,
                        canvasElement.height
                    );

                    try {
                        await axios.post(
                            `${SERVER_URL}/editor/pages`,
                            {
                                pageContent: canvasElement.toDataURL(),
                                notebookId: response.data.notebookId,
                            },
                            {
                                headers: {
                                    Authorization: cookies.access_token,
                                },
                            }
                        );
                    } catch (error) {
                        console.error(error);
                    }

                    await fetchNotebooks();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setShowPreLoader(false);
            }
        } else {
            try {
                Object.assign(val, notebook);
                await axios.put(`${SERVER_URL}/editor/notebooks`, val, {
                    headers: {
                        Authorization: cookies.access_token,
                    },
                });
                // alert(response.data.message);
                fetchNotebooks();
            } catch (error) {
                console.error(error);
            } finally {
                setShowPreLoader(false);
            }
        }
        setShowNotebookForm(false);
    };

    return (
        <section className="notebook-form">
            <div className="notebook-form-container">
                <button
                    className="hide-btn btn-icon"
                    type="button"
                    onClick={() => setShowNotebookForm(false)}
                >
                    <CloseIcon className="icon close-icon" />
                </button>
                <form onSubmit={handleSubmit}>
                    <h1>{purpose} Notebook</h1>

                    <div>
                        <label htmlFor="notebookHeading">-Heading-</label>
                        <br />
                        <input
                            placeholder="e.g.- Machine Learning"
                            required
                            type="text"
                            name="notebookHeading"
                            id="notebookHeading"
                            value={notebook.notebookHeading}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="notebookDescription">
                            -Description-
                        </label>
                        <br />
                        <input
                            placeholder="e.g.- This is a virtual notebook for machine learning."
                            required
                            type="text"
                            name="notebookDescription"
                            id="notebookDescription"
                            value={notebook.notebookDescription}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="notebookBackgroundColor">
                            -Background Color-
                        </label>
                        <br />
                        <input
                            required
                            type="color"
                            name="notebookBackgroundColor"
                            id="notebookBackgroundColor"
                            value={notebook.notebookBackgroundColor}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        type="submit"
                        name={purpose === "Edit" ? "Save" : "Add"}
                    />
                </form>
            </div>
        </section>
    );
};

export default NotebookForm;
