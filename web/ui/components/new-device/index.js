import Image from "next/image";
import Logo from "@/public/logo/epaper.svg";
import { Input, Textarea } from "@nextui-org/react";
import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState } from "react"
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const NewDevice = () => {
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState(0);

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            name: name,
        }

        console.log(data)
        instanceCoreApi.post(`${API}/devices`, data).then(response => {
            console.log(response.data);
            setSubmitted(true);
        }).catch(error => {
            console.error(error)
            setSubmitted(false);
        })
    };

    const resetState = () => {
        setName("");
    }

    return (
        (!submitted) ? (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <h1>Create a new Device</h1>
                <Image alt="logo" src={Logo}></Image>
                <form className="form" onSubmit={handleSubmit}>

                    <Input
                        className="input"
                        label="A pretty name"
                        placeholder="EPD numba wan"
                        onChange={(e) => setName(e.target.value)}
                    />

                    {console.log(`Name: ${name}`)}

                    <button type="submit" className="dark:bg-dark-background">Create</button>
                </form>
            </div>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <h1>The EPD device {name} is created sucessfully!</h1>
                <br />
                <p>You can see device detail and its display status by going to Dashboard - Devices</p>
                <br />
                <button className="ok" onClick={() => resetState()}>
                    <Link href="/dashboard/devices">Let&apos;s go!</Link>
                </button>
            </div>
        )
    );
};

export default NewDevice;
