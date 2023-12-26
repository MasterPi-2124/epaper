import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState, useEffect, useRef } from "react"
import { Dropdown } from "@nextui-org/react";
import Link from "next/link";
// import Notify from 'notiflix/build/notiflix-notify-aio';
import { Notify } from "notiflix";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const ChooseDevice = ({ dataCreated, setDataCreated, stage, setStage, handleReset, handleSubmit }) => {
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
        setDataCreated(dataCreated => ({
            ...dataCreated,
            ...userTyped
        }))
    }

    const getActiveDevices = async () => {
        try {
            await instanceCoreApi.get(`${API}/devices?active=true`).then((res) => {
                setDevices(res.data.data);
                Notify.success(`Fetched all active devices successfully!`);
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

            if (dataCreated.designSchema === "Theme 1") {
                style["color"] = "red";
            } else if (dataCreated.designSchema === "Theme 2") {
                style["color"] = "blue";
            } else if (dataCreated.designSchema === "Theme 3") {
                style["color"] = "yellow";
            } else {
                style["color"] = "orange";
            }

            if (dataCreated.fontStyle === "Monospace 8pt") {
                style["font"] = "8px Times New Roman";
            } else if (dataCreated.fontStyle === "Monospace 12pt") {
                style["font"] = "12px Segoe UI";
            } else if (dataCreated.fontStyle === "Monospace 16pt") {
                style["font"] = "16px";
            } else if (dataCreated.fontStyle === "Monospace 24pt") {
                style["font"] = "24px";
            } else if (dataCreated.fontStyle === "Segoe UI 8pt") {
                style["font"] = "28px";
            } else if (dataCreated.fontStyle === "Segoe UI 12pt") {
                style["font"] = "32px";
            } else if (dataCreated.fontStyle === "Segoe UI 16pt") {
                style["font"] = "36px";
            } else {
                style["font"] = "40px Segoe UI";
            }

            ctx.font = style.font;
            ctx.fillStyle = style.color;
            ctx.fillText(`Name: ${dataCreated.name}`, 10, 30);
            ctx.fillText(`Email: ${dataCreated.email}`, 10, 60);
        }
    }, [style, dataCreated, stage])

    return (
        (stage === 2) ? (
            <>
                <h1>Create new Data</h1>
                <canvas className="render-canvas" ref={canvaRef} width="340" height="150" />
                <form className="form" onSubmit={handleSubmit}>
                    <label className="dark:text-dark-text text-light-text">Choose a device, and theme to display. Example view will be displayed above.</label>
                    <Dropdown>
                        <Dropdown.Button flat className="devices-choices">
                            {(dataCreated.deviceID !== "") ? dataCreated.deviceName : 'Choose a device'}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="primary"
                            items={devices}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={dataCreated.deviceID}
                        >
                            {(deviceLoading && devices.length) ? (
                                devices?.map((device) =>
                                    <Dropdown.Item key={device._id}>
                                        <button
                                            onClick={(e) => {
                                                handleChange("deviceID", device._id);
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
                                                Device ID: {device._id}
                                            </p>
                                        </button>
                                    </Dropdown.Item>
                                )
                            ) : deviceLoading === 0 ? (
                                <Dropdown.Item style={{ color: "white" }} >
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
                            {(dataCreated.fontStyle !== "") ? dataCreated.fontStyle : 'Choose a font'}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="primary"
                            items={fonts}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={dataCreated.fontStyle}
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
                            {(dataCreated.designSchema !== "") ? dataCreated.designSchema : 'Choose a theme'}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="primary"
                            items={themes}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={dataCreated.designSchema}
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


                    {console.log(`Name: `, dataCreated.name)}
                    {console.log(`Email: `, dataCreated.email)}
                    {console.log(`Address: `, dataCreated.address)}
                    {console.log(`Write on EPD?: `, dataCreated.active)}
                    {console.log(`Device: `, dataCreated.deviceID)}
                    {console.log(`Font: `, dataCreated.fontStyle)}
                    {console.log(`Theme: `, dataCreated.designSchema)}

                    <button type="submit">Submit</button>
                    <button onClick={() => {
                        setStage(0);
                        handleReset();
                    }}>Back</button>
                </form>
            </>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <h1>Data information is submitted successfully! </h1>
                <p> and displayed on the EPD device! You can go to Dashboard/Data to see and manage your data information.</p>
                <br />
                <button className="ok" onClick={() => {
                    setStage(-1);
                    handleReset();
                }}>
                    <Link href="/dashboard/data">Let&apos;s go!</Link>
                </button>
            </div>
        )
    );
};

export default ChooseDevice;