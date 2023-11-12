import React, { useState, useMemo } from "react"
import { Input, Switch } from "@nextui-org/react";
import Image from "next/image";
import Logo from "@/public/logo/epaper.svg";
import Link from "next/link";

const CreateUser = ({ userCreated, setUserCreated, stage, handleStage, handleReset, handleSubmit }) => {
    const handleChange = (param, e) => {
        let userTyped = {};
        if (param === "active") {
            userTyped[param] = e.target.checked;
        } else {
            userTyped[param] = e.target.value;
        }
        setUserCreated(userCreated => ({
            ...userCreated,
            ...userTyped
        }))
    }

    return (
        (stage === 0) ? (
            <>
                <h1>Hi</h1>
                <Image alt="logo" src={Logo}></Image>
                <form className="form" onSubmit={handleStage}>
                    <label className="dark:text-dark-text text-light-text">First, fill in your information to continue</label>
                    <Input
                        className="input"
                        required
                        label="Name"
                        type="text"
                        onChange={(e) => handleChange("name", e)}
                    />

                    <Input
                        className="input"
                        label="Email"
                        required
                        type="email"
                        onChange={(e) => handleChange("email", e)}
                    />

                    <Input
                        className="input"
                        label="Address"
                        required
                        type="text"
                        onChange={(e) => handleChange("address", e)}
                    />

                    <div className="switch">
                        <label>Display on EPD?</label>
                        <Switch
                            className="input"
                            bordered
                            label="EPD display?"
                            onChange={(e) => handleChange("active", e)}
                        />
                    </div>

                    {console.log(`Name: `, userCreated.name)}
                    {console.log(`Email: `, userCreated.email)}
                    {console.log(`Address: `, userCreated.address)}
                    {console.log(`Write on EPD?: `, userCreated.active)}

                    {userCreated.active ? (
                        <button type="button" onClick={handleStage}>
                            Continue
                        </button>
                    ) : (
                        <button type="submit" onClick={handleSubmit}>
                            Submit
                        </button>
                    )}
                </form>
            </>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <h1>Your information is successfully submitted!</h1>
                <br />
                <p> Your personnal information is saved in our database, but you chose not to display it on EPD device yet.</p>
                <button className="ok" onClick={() => handleReset()}>
                    <Link href="/dashboard/users">Let&apos;s go!</Link>
                </button>
            </div>
        )
    );
};

export default CreateUser;