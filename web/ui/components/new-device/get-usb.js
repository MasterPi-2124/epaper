import React, { useState, useEffect } from 'react';
import { Notify } from "notiflix";
import { Input } from "@nextui-org/react";

const GetUSBDevice = ({ deviceCreated, setDeviceCreated, port, setPort, handleSubmit }) => {
    const connectESP = async () => {
        if ("serial" in navigator) {
            try {
                const newPort = await navigator.serial.requestPort();
                await newPort.open({ baudRate: 115200 });
                setPort(newPort);
                Notify.success(`Opening serial port successfully! ${newPort.getInfo().usbVendorId}:${newPort.getInfo().usbProductId}`, {
                    className:"notiflix-success"
                });
            } catch (error) {
                Notify.warning(`Error opening serial port. Please refreshing the page.`, {
                    className: "notiflix-warning"
                });
            }
        } else {
            Notify.failure(`Sorry, this browser doesn't support webSerial`, {
                className: "notiflix-failure"
            });
        }
    }

    const handleChange = (param, e) => {
        let userTyped = {};
        userTyped[param] = e.target.value;
        setDeviceCreated(deviceCreated => ({
            ...deviceCreated,
            ...userTyped
        }))
    }

    return (
        <div className="content text-light-text dark:text-dark-text">
            <h1>Create a new Device</h1>
            <br />
            {port ? (
                <>
                    <form className="form" onSubmit={handleSubmit}>
                        <label className="dark:text-dark-text text-light-text">Fill your device information to continue</label>
                        <Input
                            className="input"
                            required
                            label="A pretty name"
                            type="text"
                            onChange={(e) => handleChange("name", e)}
                        />

                        <Input
                            className="input"
                            label="Network SSID"
                            required
                            type="text"
                            onChange={(e) => handleChange("ssid", e)}
                        />

                        <Input.Password
                            className="input"
                            label="Network password"
                            required
                            onChange={(e) => handleChange("pass", e)}
                        />

                        {console.log(`Name: `, deviceCreated.name)}
                        {console.log(`SSID: `, deviceCreated.ssid)}
                        {console.log(`Password: `, deviceCreated.pass)}
                        {console.log(`active: `, deviceCreated.active)}
                        {console.log(`dataID: `, deviceCreated.dataID)}

                        <button>
                            Write and Publish
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <p>
                        To start, please plug your ESP device to this machine via USB port.
                        <br />
                        When the device is connected, choose device below and continue.
                    </p>
                    <br />
                    <button className="ok" onClick={connectESP}>
                        Choose a device
                    </button>
                </>
            )}
        </div>
    )
}

export default GetUSBDevice;