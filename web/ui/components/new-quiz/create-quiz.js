import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState } from "react"
import { Input, Switch } from "@nextui-org/react";
import Image from "next/image";
import Logo from "@/public/logo/cnweb-30.png";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API;

const CreateQuiz = ({ handleReset }) => {
    const [submitOK, setSubmitOK] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [active, setActive] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            name: name,
            email: email,
            address: address,
            active: active,
            activeTime: activeTime
        }

        console.log(data)
        instanceCoreApi.post(`${API}/users`, data).then(response => {
            console.log(response.data);
            setSubmitOK(true);
        }).catch(error => {
            console.error(error)
            setSubmitOK(false);
        })
    };

    const resetState = () => {
        setName("");
        setEmail("");
        setAddress("");
        setActive(false);
    }

    return (
        <>
            {!submitOK ? (
                <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                        <h1>Hi</h1>
                        <Image alt="logo" src={Logo}></Image>
                        <form className="form" onSubmit={handleSubmit}>
                            <Input
                                className="input"
                                required
                                label="Name"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Input
                                className="input"
                                label="Email"
                                required
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                className="input"
                                label="Address"
                                required
                                type="text"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <div className="switch">
                                <label>Display on EPD?</label>
                                <Switch
                                    className="input"
                                    bordered
                                    label="EPD display?"
                                    isSelected={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                />
                            </div>
                            
                            {console.log(`Name: `, name)}
                            {console.log(`Email: `, email)}
                            {console.log(`Address: `, address)}
                            {console.log(`Write on EPD?: `, active)}

                            <button type="submit">Create</button>
                            <button onClick={handleReset}>Back</button>
                        </form>
                </div>
            ) : (
            <div className="content text-light-text dark:text-dark-text">
                    <h1>Your information is successfully updated</h1>
                    <br />
                    <p>We are updating your information in the epaper</p>
                    <br />
                    <button className="ok" onClick={() => resetState()}>
                        <Link href="/dashboard/users">Let&apos;s go!</Link>
                    </button>
                    </div>
            )}
        </>
    );
};

export default CreateQuiz;