import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState, useEffect } from "react"
import { Input, Switch } from "@nextui-org/react";
import { Dropdown } from "@nextui-org/react";
import Image from "next/image";
import Logo from "@/public/logo/epaper.svg";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const ChooseDevice = ({ userCreated, setUserCreated, stage, handleReset, handleSubmit }) => {
    const [devices, setDevices] = useState();
    const fonts = [ "Monospace 8pt",
                    "Monospace 12pt",
                    "Monospace 16pt",
                    "Monospace 24pt",
                    "Segoe UI 8pt",
                    "Segoe UI 12pt",
                    "Segoe UI 16pt",
                    "Segoe UI 20pt",
                  ]
    const themes = [ "Theme 1",
                     "Theme 2",
                     "Theme 3",
                     "Theme 4",
                   ]

    const handleChange = (param, value) => {
        let userTyped = {};
        userTyped[param] = value;
        setUserCreated(userCreated => ({
            ...userCreated,
            ...userTyped
        }))
    }

    const getDevices = async () => {
        try {
            await instanceCoreApi.get(`${API}/devices`).then((res) => {
                setDevices(res.data.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getDevices();
    }, []);

    return (
        (stage === 2) ? (
            <>
                <h1>Hi</h1>
                <Image alt="logo" src={Logo}></Image>
                <p> rendered text will be displayed above</p>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="dark:text-dark-text text-light-text">Choose a device to display</label>
                    <Dropdown>
                        <Dropdown.Button flat className="devices-choices">
                            {(userCreated.deviceID !== "") ? userCreated.deviceID : 'Choose a device'}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="primary"
                            items={devices}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={userCreated.deviceID}
                        >
                            {devices?.map((device) => {
                                return <Dropdown.Item key={device._id}>
                                    <button
                                        onClick={(e) => handleChange("deviceID", device._id)}
                                        style={{
                                            padding: "10px 0px"
                                        }}
                                        className="w-full dropdown-item"
                                    >
                                        <p style={{
                                            textAlign: "left",
                                            color: "white"
                                        }}
                                        >
                                            {device.name}
                                        </p>
                                        <p style={{
                                            textAlign: "left",
                                            color: "rgb(177, 177, 177)",
                                            fontSize: "10px"
                                        }}
                                        >
                                            Device ID: {device._id}
                                        </p>
                                    </button>
                                </Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Button flat className="devices-choices">
                            {(userCreated.fontStyle !== "") ? userCreated.fontStyle : 'Choose a font'}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="primary"
                            items={fonts}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={userCreated.fontStyle}
                        >
                            {fonts?.map((font) => {
                                return <Dropdown.Item key={font}>
                                    <button
                                        onClick={(e) => handleChange("fontStyle", font)}
                                        style={{
                                            padding: "10px 0px"
                                        }}
                                        className="w-full dropdown-item"
                                    >
                                        <p style={{
                                            textAlign: "left",
                                            color: "white"
                                        }}
                                        >
                                            {font}
                                        </p>
                                    </button>
                                </Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Button flat className="devices-choices">
                            {(userCreated.designSchema !== "") ? userCreated.designSchema : 'Choose a theme'}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="primary"
                            items={themes}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={userCreated.designSchema}
                        >
                            {themes?.map((theme) => {
                                return <Dropdown.Item key={theme}>
                                    <button
                                        onClick={(e) => handleChange("designSchema", theme)}
                                        style={{
                                            padding: "10px 0px"
                                        }}
                                        className="w-full dropdown-item"
                                    >
                                        <p style={{
                                            textAlign: "left",
                                            color: "white"
                                        }}
                                        >
                                            {theme}
                                        </p>

                                    </button>
                                </Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>


                    {console.log(`Name: `, userCreated.name)}
                    {console.log(`Email: `, userCreated.email)}
                    {console.log(`Address: `, userCreated.address)}
                    {console.log(`Write on EPD?: `, userCreated.active)}
                    {console.log(`Device: `, userCreated.deviceID)}
                    {console.log(`Font: `, userCreated.fontStyle)}
                    {console.log(`Theme: `, userCreated.designSchema)}

                    <button type="submit">Submit</button>
                    <button onClick={handleReset}>Back</button>
                </form>
            </>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <h1>Your information is successfully submitted and displayed on the EPD device!</h1>
                <br />
                <button className="ok" onClick={() => handleReset()}>
                    <Link href="/dashboard/users">Let&apos;s go!</Link>
                </button>
            </div>
        )
    );
};

export default ChooseDevice;