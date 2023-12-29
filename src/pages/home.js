import { ReactComponent as WhatImage } from "../assets/images/image-1.svg";
import { ReactComponent as WhyImage } from "../assets/images/image-2.svg";
import { ReactComponent as AvailabilityIcon } from "../assets/icons/availability.svg";
import { ReactComponent as EcoFriendlyIcon } from "../assets/icons/eco-friendly.svg";
import { ReactComponent as InterfaceIcon } from "../assets/icons/interface.svg";
import { ReactComponent as ShareIcon } from "../assets/icons/share.svg";
import { ReactComponent as GithubIcon } from "../assets/icons/github.svg";
import { ReactComponent as LinkedinIcon } from "../assets/icons/linkedin.svg";
import { ReactComponent as TwitterIcon } from "../assets/icons/twitter.svg";
import { ReactComponent as WebsiteIcon } from "../assets/icons/website.svg";
import Button from "../components/button";
import JoinInput from "../components/joinInput";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import video from "../assets/videos/video.mp4";

export const Home = () => {
    const ADVANTAGES = [
        {
            icon: <AvailabilityIcon className="advantage-icon" />,
            heading: "AVAILABILITY",
            content:
                "Users can access their virtual notebooks from any device with internet connectivity, eliminating the need to carry physical notebooks",
        },
        {
            icon: <EcoFriendlyIcon className="advantage-icon" />,
            heading: "ECO-FRIENDLY",
            content:
                "Reducing paper consumption and the environmental footprint associated with the production and disposal of physical notebooks.",
        },
        {
            icon: <InterfaceIcon className="advantage-icon" />,
            heading: "INTERFACE",
            content:
                "Offers an intuitive and user-friendly interface, ensuring a smooth and enjoyable experience for those new to virtual note-taking.",
        },
        {
            icon: <ShareIcon className="advantage-icon" />,
            heading: "SHARING",
            content:
                "Users can quickly and directly share a specific page or the entire notebook with others, making it efficient for personal or professional communication.",
        },
    ];

    const whatSectionRef = useRef(null);
    const whySectionRef = useRef(null);
    const howSectionRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();

    return (
        <>
            <main className="page home-page">
                <section ref={whatSectionRef} className="section what-section">
                    <WhatImage className="image what-image" />
                    <div className="content">
                        <h1 className="main-heading">WHAT?</h1>
                        <p className="content-data">
                            An open-source web app that lets you create and
                            manage virtual notebooks with an intuitive editor to
                            organise your thoughts and ideas.
                        </p>
                        <Button
                            name="EXPLORE"
                            handleButtonClick={() => {
                                if (!whySectionRef.current) return;
                                window.scrollTo({
                                    top:
                                        whySectionRef.current.getBoundingClientRect()
                                            .top +
                                        window.scrollY -
                                        90,
                                });
                            }}
                        />
                    </div>
                </section>
                <section ref={whySectionRef} className="section why-section">
                    <WhyImage className="image why-image" />
                    <div className="content">
                        <h1 className="main-heading">WHY?</h1>
                        <p className="content-data">
                            Unlike physical notebooks, this is a paperless
                            approach that's eco-friendly, available worldwide at
                            any time and sharing is also possible.
                        </p>
                        <Button
                            name="TRY IT"
                            handleButtonClick={() => {
                                if (!howSectionRef.current) return;
                                window.scrollTo({
                                    top:
                                        howSectionRef.current.getBoundingClientRect()
                                            .top +
                                        window.scrollY -
                                        90,
                                });
                            }}
                        />
                    </div>
                </section>
                <div className="advantages">
                    {ADVANTAGES.map((val, indx) => {
                        return (
                            <article
                                key={`advantage-${indx + 1}`}
                                className="advantage"
                            >
                                {val.icon}
                                <h2 className="advantage-heading">
                                    {val.heading}
                                </h2>
                                <p className="advantage-content">
                                    {val.content}
                                </p>
                            </article>
                        );
                    })}
                </div>
                <section ref={howSectionRef} className="section how-section">
                    <div className="content">
                        <h1 className="main-heading">HOW?</h1>
                        <p className="content-data">
                            With our amazing documentation, unlock the full
                            potential of the web app in just a few simple steps.
                        </p>
                        <video className="guide-video" controls>
                            <source src={video} type="video/mp4" />
                        </video>
                        <Button
                            name="GET STARTED"
                            handleButtonClick={() => navigate("/guide")}
                        />
                    </div>
                </section>
                <section className="section join-section">
                    <h1 className="main-heading">JOIN US</h1>
                    <JoinInput />
                </section>
            </main>
            <footer className="home-page-footer">
                <article>
                    <h1 className="main-heading">NEED HELP?</h1>
                    <Button
                        name="Contact"
                        handleButtonClick={() => navigate("/contact")}
                    />
                    <aside>
                        <div className="platform-icons">
                            <a
                                href="https://github.com/skykingravi"
                                target="_blank"
                                rel="noreferrer"
                                title="GitHub"
                            >
                                <GithubIcon className="platform-icon" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/ravi-meena-85902922b/"
                                target="_blank"
                                rel="noreferrer"
                                title="LinkedIn"
                            >
                                <LinkedinIcon className="platform-icon" />
                            </a>
                            <a
                                href="https://twitter.com/iamskyking01"
                                target="_blank"
                                rel="noreferrer"
                                title="Twitter"
                            >
                                <TwitterIcon className="platform-icon" />
                            </a>
                            <a
                                href="https://ravis-portfolio.vercel.app/"
                                target="_blank"
                                rel="noreferrer"
                                title="Portfolio"
                            >
                                <WebsiteIcon className="platform-icon" />
                            </a>
                        </div>
                        <p className="bug-fix">
                            Find an issue with this app?
                            <span className="github-link">
                                <a
                                    href="https://github.com/skykingravi"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Fix it on GitHub
                                </a>
                            </span>
                        </p>
                        <p className="copyright">Copyright © markers.io 2023</p>
                    </aside>
                </article>
            </footer>
        </>
    );
};
