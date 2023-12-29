import React, { useCallback, useEffect, useState } from "react";
import PreLoader from "../components/preLoader";
import axios from "axios";
import { useGetURL } from "../hooks/useGetURL";
import Button from "../components/button.js";
import jsPDF from "jspdf";

const Share = () => {
    const [pagesData, setPagesData] = useState([]);
    const [showPreLoader, setShowPreLoader] = useState([]);
    const [, SERVER_URL] = useGetURL();
    const fetchPages = useCallback(
        async (id) => {
            try {
                setShowPreLoader(true);
                const response = await axios.get(
                    `${SERVER_URL}/editor/pages/${id}`
                );
                setPagesData(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setTimeout(() => {
                    setShowPreLoader(false);
                }, 2000);
            }
        },
        [SERVER_URL]
    );

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const notebook = queryParams.get("notebook");
        fetchPages(notebook);
    }, [fetchPages]);

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

    const handleDownload = async () => {
        if (!pagesData) return;
        setShowPreLoader(true);
        getDataUrlImages(pagesData)
            .then((images) => {
                const pdf = new jsPDF({
                    orientation: images[0].width > images[0].height ? "l" : "p",
                    unit: "pt",
                    format: [images[0].width, images[0].height],
                });
                for (let i = 0; i < images.length; i++) {
                    pdf.addImage(
                        pagesData[i].pageContent,
                        "PNG",
                        0,
                        0,
                        images[i].width,
                        images[i].height
                    );

                    if (i !== pagesData.length - 1) {
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
            })
            .finally(() => setShowPreLoader(false));
    };

    return (
        <>
            <section className="page share-page">
                {pagesData.map((val, indx) => {
                    return (
                        <div key={val._id}>
                            <img
                                src={val.pageContent}
                                alt={`Page ${indx + 1}`}
                            />
                            <p>{indx + 1}</p>
                        </div>
                    );
                })}
                <Button name="Download" handleButtonClick={handleDownload} />
            </section>
            {showPreLoader && <PreLoader />}
        </>
    );
};

export default Share;
