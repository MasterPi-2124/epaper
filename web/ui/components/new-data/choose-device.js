import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState, useEffect, useRef } from "react"
import { Dropdown } from "@nextui-org/react";
import Link from "next/link";
import { Notify } from "notiflix";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const ChooseDevice = ({ dataCreated, setDataCreated, stage, setStage, handleReset, handleSubmit }) => {
    const [deviceLoading, setDeviceLoading] = useState(0);
    const [devices, setDevices] = useState();
    const fonts = [ "Monospace 12pt",
                    "Monospace 16pt",
                    "Monospace 20pt",
                    "Segoe UI Light, 11pt",
                    "Segoe UI Bold, 11pt",
                    "Segoe UI Light, 16pt",
                    "Segoe UI Bold, 16pt",
                    "Segoe UI Light, 20pt",
    ]
    const themes = ["Theme 1",
                    "Theme 2",
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
            Notify.info("Fetching for all active devices", {
                className: "notiflix-info",
                timeout: 6500,
            })
            await instanceCoreApi.get(`${API}/devices?active=true`).then((res) => {
                setDevices(res.data.data);
                Notify.success(`Fetched all active devices successfully!`, {
                    className: "notiflix-success",
                });
                setDeviceLoading(1);
            })
        }
        catch (err) {
            console.error(err);
            setDeviceLoading(-1);
            Notify.failure(`Error fetching active devices data: ${err}`, {
                className: "notiflix-failure"
            });
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
                style["color"] = "black";
            } else if (dataCreated.designSchema === "Theme 2") {
                style["color"] = "blue";
            } else if (dataCreated.designSchema === "Theme 3") {
                style["color"] = "yellow";
            } else {
                style["color"] = "black"; // default to Theme 1
            }

            if (dataCreated.fontStyle === "Monospace 12pt") {
                style["font"] = "12px monospace";
            } else if (dataCreated.fontStyle === "Monospace 16pt") {
                style["font"] = "16px monospace";
            } else if (dataCreated.fontStyle === "Monospace 20pt") {
                style["font"] = "24px monospace";
            } else if (dataCreated.fontStyle === "Segoe UI Light, 11pt") {
                style["font"] = "200 12px Segoe UI";
            } else if (dataCreated.fontStyle === "Segoe UI Bold, 11pt") {
                style["font"] = "bold 20px Segoe UI";
            } else if (dataCreated.fontStyle === "Segoe UI Light, 16pt") {
                style["font"] = "200 24px Segoe UI";
            }  else if (dataCreated.fontStyle === "Segoe UI Bold, 16pt") {
                style["font"] = "bold 24px Segoe UI";
            }  else if (dataCreated.fontStyle === "Segoe UI Light, 20pt") {
                style["font"] = "200 36px Segoe UI";
            } else {
                style["font"] = "bold 24px Segoe UI"; // default to Segoe UI Bold, 16pt
            }

            if (dataCreated.type === "Product") {
                if (dataCreated.designSchema === "Theme 1") {
                    ctx.font = '200 12px Segoe UI';
                    ctx.fillStyle = style.color;
                    ctx.fillText(`${dataCreated.input2}`, 10, 40);
    
                    ctx.font = style.font;
                    ctx.fillStyle = style.color;
                    ctx.fillText(`${dataCreated.name}`, 10, 70);
    
                    ctx.font = "bold 36px Segoe UI";
                    ctx.fillStyle = style.color;
                    ctx.fillText(`${dataCreated.input3}`, 120, 90);
                } else if (dataCreated.designSchema === "Theme 2") {
                    ctx.font = style.font;
                    ctx.fillStyle = style.color;
                    ctx.fillText(`${dataCreated.input2}`, 10, 30);
    
                    ctx.font = style.font;
                    ctx.fillStyle = style.color;
                    ctx.fillText(`${dataCreated.name}`, 10, 60);
    
                    ctx.font = style.font;
                    ctx.fillStyle = style.color;
                    ctx.fillText(`Email: ${dataCreated.input3}`, 10, 90);
                }
            } else if (dataCreated.type === "Client") {
                ctx.font = style.font;
                ctx.fillStyle = style.color;
                ctx.fillText(`Name: ${dataCreated.name}`, 10, 30);
                ctx.fillText(`Email: ${dataCreated.email}`, 10, 60);
            } else if (dataCreated.type === "Student") {
                ctx.font = style.font;
                ctx.fillStyle = style.color;
                ctx.fillText(`Name: ${dataCreated.name}`, 10, 30);
                ctx.fillText(`Email: ${dataCreated.email}`, 10, 60);
            } else if (dataCreated.type === "Employee") {
                ctx.font = style.font;
                ctx.fillStyle = style.color;
                ctx.fillText(`Name: ${dataCreated.name}`, 10, 30);
                ctx.fillText(`Email: ${dataCreated.email}`, 10, 60);
            } else if (dataCreated.type === "Room") {
                ctx.font = style.font;
                ctx.fillStyle = style.color;
                ctx.fillText(`Name: ${dataCreated.name}`, 10, 30);
                ctx.fillText(`Email: ${dataCreated.email}`, 10, 60);
            }
        }
    }, [style, dataCreated, stage])

    return (
        (stage === 2) ? (
            <>
            {console.log(dataCreated)}
                <h1 style ={{
                    marginBottom: "10px",
                }}>Choose display device</h1>
                <canvas className="render-canvas" ref={canvaRef} width="340" height="150" />
                <form className="form" onSubmit={handleSubmit}>
                    <label className="dark:text-dark-text text-light-text">Choose a device, font style and theme to display. Example view will be displayed above.</label>
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
                                <Dropdown.Item css={{ color: "white" }} >
                                    Getting active devices ...
                                </Dropdown.Item>
                            ) : (
                                <Dropdown.Item css={{color: "white"}}>
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
                <h1>Your data is submitted successfully!</h1>
                <p style={{textAlign: "center", marginTop: "10px"}}>And it is also being displayed on device {`${dataCreated.deviceName}`}. You can go to Dashboard/Data to see and manage your data.</p>
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