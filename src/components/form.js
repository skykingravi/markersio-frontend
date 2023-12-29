import React from "react";
import Button from "./button";

const Form = ({
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    userPassword,
    setUserPassword,
    rememberCheck,
    setRememberCheck,
    label,
    onSubmit,
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className={
                label === "register" ? "register-wrapper" : "login-wrapper"
            }
        >
            <h1>{label === "login" ? "WELCOME BACK" : "CREATE AN ACCOUNT"}</h1>
            {label === "register" && (
                <div>
                    <label htmlFor="userName">Name:</label>
                    <br />
                    <input
                        autoComplete="name"
                        placeholder="ex: Ravi"
                        required
                        type="text"
                        name="userName"
                        id="userName"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                    />
                </div>
            )}
            <div>
                <label htmlFor={label + "-userEmail"}>Email:</label>
                <br />
                <input
                    autoComplete="email"
                    placeholder="ex: r3@gmail.com"
                    required
                    type="email"
                    name={label + "-userEmail"}
                    id={label + "-userEmail"}
                    value={userEmail}
                    onChange={(event) => setUserEmail(event.target.value)}
                />
            </div>
            <div>
                <label htmlFor={label + "-userPassword"}>Password:</label>
                <br />
                <input
                    autoComplete="password"
                    placeholder="ex: 1234"
                    required
                    type="password"
                    name={label + "-userPassword"}
                    id={label + "-userPassword"}
                    value={userPassword}
                    onChange={(event) => setUserPassword(event.target.value)}
                />
            </div>
            {label === "login" && (
                <div>
                    <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        checked={rememberCheck}
                        onChange={() =>
                            setRememberCheck((prevState) => !prevState)
                        }
                    />
                    <label htmlFor="remember">Remember Me</label>
                </div>
            )}
            <Button
                type="submit"
                name={label === "login" ? "LOG IN" : "REGISTER"}
            />
        </form>
    );
};

export default Form;
