import React, { useState, useEffect } from 'react';
import Notify from 'notiflix/build/notiflix-notify-aio';
import { Input } from "@nextui-org/react";

const GetUSBDevice = ({ deviceCreated, setDeviceCreated, handleSubmit }) => {
    const [port, setPort] = useState(null);

    useEffect(() => {
        const handleConnect = (e) => {
            Notify.Notify.info("A new device is connected!");
            setPort(e.port);
        }

        const handleDisconnect = (e) => {
            Notify.Notify.info("A device is disconnected!");
            if (port && e.port === port) {
                setPort(null);
            }
        }
        navigator.serial.addEventListener("connect", handleConnect);

        navigator.serial.addEventListener("disconnect", handleDisconnect);

        return () => {
            navigator.serial.removeEventListener("connect", handleConnect);
            navigator.serial.removeEventListener("disconnect", handleDisconnect);
        };
    }, [port]);

    const connectESP = async () => {
        if ("serial" in navigator) {
            try {
                const newPort = await navigator.serial.requestPort();
                await newPort.open({ baudRate: 115200 });
                setPort(newPort);
                Notify.Notify.success(`Opening serial port successfully! ${newPort.getInfo().usbVendorId}:${newPort.getInfo().usbProductId}`);
            } catch (error) {
                Notify.Notify.failure(`Error opening serial port: ${error}`);
            }
        } else {
            Notify.Notify.failure(`Sorry, this browser doesn't support webSerial`);
        }
    }

    const sendData = async (deviceInfo) => {
        if (port) {
            const writer = port.writable.getWriter();
            for (const [key, value] of Object.entries(deviceInfo)) {
                const keyValue = `${key}:${value}\n`;
                console.log(keyValue);
                const data = new TextEncoder().encode(keyValue);
                await writer.write(data);
            }
            writer.releaseLock();
            Notify.Notify.success(`Write device info to device successfully!`);
        }
    }

    const handleChange = (param, e) => {
        let userTyped = {};
        if (param === "id") {
            userTyped[param] = e.target.value.toString()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-');
        } else {
            userTyped[param] = e.target.value;
        }
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
                            onChange={(e) => handleChange("id", e)}
                        />

                        <Input
                            className="input"
                            label="Network SSID"
                            required
                            type="text"
                            onChange={(e) => handleChange("ssid", e)}
                        />

                        <Input
                            className="input"
                            label="Network password"
                            required
                            type="password"
                            onChange={(e) => handleChange("pass", e)}
                        />

                        {console.log(`ID: `, deviceCreated.id)}
                        {console.log(`SSID: `, deviceCreated.ssid)}
                        {console.log(`Password: `, deviceCreated.pass)}
                        {console.log(`active: `, deviceCreated.active)}
                        {console.log(`userID: `, deviceCreated.userID)}

                        <button onClick={() => sendData(deviceCreated)}>
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