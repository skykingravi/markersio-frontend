import React from "react";

const Button = ({ name, handleButtonClick = () => {}, type = "button" }) => {
    return (
        <button className="btn" onClick={handleButtonClick} type={type}>
            <span>{name}</span>
        </button>
    );
};

export default Button;
