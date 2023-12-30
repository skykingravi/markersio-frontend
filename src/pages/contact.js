import React, { useEffect, useState } from "react";
import PreLoader from "../components/preLoader";
import { useGetURL } from "../hooks/useGetURL";
import axios from "axios";
import Button from "../components/button";

const Contact = () => {
    const [showPreLoader, setShowPreLoader] = useState(false);
    const [contactData, setContactData] = useState({
        contactName: "",
        contactEmail: "",
        contactMessage: "",
    });
    const [, SERVER_URL] = useGetURL();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setContactData({ ...contactData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowPreLoader(true);
        try {
            await axios.post(`${SERVER_URL}/contact/dm`, contactData);
            // alert(response.data.message);
            setContactData({
                contactName: "",
                contactEmail: "",
                contactMessage: "",
            });
        } catch (error) {
            console.error(error);
        } finally {
            setShowPreLoader(false);
        }
    };

    return (
        <>
            <section className="page contact-page">
                <form onSubmit={handleSubmit} className="contact-wrapper">
                    <h2>Say Hi!</h2>
                    <div>
                        <label htmlFor="contactName">-Name-</label>
                        <br />
                        <input
                            placeholder="e.g.- Ravi Meena"
                            name="contactName"
                            id="contactName"
                            type="text"
                            value={contactData.contactName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="contactEmail">-Email-</label>
                        <br />
                        <input
                            placeholder="e.g.- ravi123@gmail.com"
                            name="contactEmail"
                            id="contactEmail"
                            type="email"
                            value={contactData.contactEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="contactMessage">-Message-</label>
                        <br />
                        <textarea
                            rows="8"
                            placeholder="e.g.- There's a bug!"
                            name="contactMessage"
                            id="contactMessage"
                            value={contactData.contactMessage}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <Button name="Send" type="submit" />
                </form>
            </section>
            {showPreLoader && <PreLoader />}
        </>
    );
};

export default Contact;
