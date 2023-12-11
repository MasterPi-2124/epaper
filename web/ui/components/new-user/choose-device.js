import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState, useEffect, useRef } from "react"
import { Dropdown } from "@nextui-org/react";
import Link from "next/link";
// import Notify from 'notiflix/build/notiflix-notify-aio';
import { Notify } from "notiflix";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const ChooseDevice = ({ userCreated, setUserCreated, stage, setStage, handleReset, handleSubmit }) => {
    const [deviceLoading, setDeviceLoading] = useState(0);
    const [devices, setDevices] = useState();
    const fonts = ["Monospace 8pt",
        "Monospace 12pt",
        "Monospace 16pt",
        "Monospace 24pt",
        "Segoe UI 8pt",
        "Segoe UI 12pt",
        "Segoe UI 16pt",
        "Segoe UI 20pt",
    ]
    const themes = ["Theme 1",
        "Theme 2",
        "Theme 3",
        "Theme 4",
    ]
    const canvaRef = useRef(null);

    const style = {
        font: "",
        color: "",
    };

    const handleChange = (param, value) => {
        let userTyped = {};
        userTyped[param] = value;
        setUserCreated(userCreated => ({
            ...userCreated,
            ...userTyped
        }))
    }

    const getActiveDevices = async () => {
        try {
            await instanceCoreApi.get(`${API}/devices?active=true`).then((res) => {
                setDevices(res.data.data);
                console.log(res.data.data);
                Notify.failure(`Error fetching active devices data:`);
                setDeviceLoading(1);
            })
        }
        catch (err) {
            console.error(err);
            setDeviceLoading(-1);
            Notify.failure(`Error fetching active devices data: ${err}`);
        }
    }

    useEffect(() => {
        getActiveDevices();
    }, []);

    useEffect(() => {
        if (stage === 2) {
            const canva = canvaRef.current;
            const ctx = canva.getContext("2d");

            ctx.clearRect(0, 0, canva.width, canva.height);

            if (userCreated.designSchema === "Theme 1") {
                style["color"] = "red";
            } else if (userCreated.designSchema === "Theme 2") {
                style["color"] = "blue";
            } else if (userCreated.designSchema === "Theme 3") {
                style["color"] = "yellow";
            } else {
                style["color"] = "orange";
            }

            if (userCreated.fontStyle === "Monospace 8pt") {
                style["font"] = "8px Times New Roman";
            } else if (userCreated.fontStyle === "Monospace 12pt") {
                style["font"] = "12px Segoe UI";
            } else if (userCreated.fontStyle === "Monospace 16pt") {
                style["font"] = "16px";
            } else if (userCreated.fontStyle === "Monospace 24pt") {
                style["font"] = "24px";
            } else if (userCreated.fontStyle === "Segoe UI 8pt") {
                style["font"] = "28px";
            } else if (userCreated.fontStyle === "Segoe UI 12pt") {
                style["font"] = "32px";
            } else if (userCreated.fontStyle === "Segoe UI 16pt") {
                style["font"] = "36px";
            } else {
                style["font"] = "40px Segoe UI";
            }

            ctx.font = style.font;
            ctx.fillStyle = style.color;
            ctx.fillText(`Name: ${userCreated.name}`, 10, 30);
            ctx.fillText(`Email: ${userCreated.email}`, 10, 60);
        }
    }, [style, userCreated, stage])

    return (
        (stage === 2) ? (
            <>
                <h1>Hi</h1>
                <canvas className="render-canvas" ref={canvaRef} width="340" height="150" />
                <form className="form" onSubmit={handleSubmit}>
                    <label className="dark:text-dark-text text-light-text">Choose a device, and theme to display. Example view will be displayed above.</label>
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
                            {(deviceLoading && devices.length) ? (
                                <>
                                {console.log(devices)}
                                    {devices?.map((device) => {
                                        return <Dropdown.Item key={`${device._id}`}>
                                            <button
                                                onClick={(e) => {
                                                    handleChange("deviceID", `${device._id}`);
                                                    handleChange("deviceName", device.name);
                                                }}
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
                                                    Device ID: {`${device._id}`}
                                                </p>
                                            </button>
                                        </Dropdown.Item>
                                    })}
                                </>
                            ) : deviceLoading === 0 ? (
                                <Dropdown.Item style={{color: "white"}} >
                                    Getting active devices ...
                                </Dropdown.Item>
                            ) : (
                                <Dropdown.Item>
                                    No active devices are found!
                                </Dropdown.Item>
                            )}

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
                    <button onClick={() => {
                        setStage(0);
                        handleReset();
                    }}>Back</button>
                </form>
            </>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <h1>User information is submitted successfully! </h1>
                <p> and displayed on the EPD device! You can go to Dashboard/Users to see and manage your user information.</p>
                <br />
                <button className="ok" onClick={() => {
                    setStage(-1);
                    handleReset();
                }}>
                    <Link href="/dashboard/users">Let&apos;s go!</Link>
                </button>
            </div>
        )
    );
};

export default ChooseDevice;