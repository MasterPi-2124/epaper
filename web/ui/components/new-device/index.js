import { instanceCoreApi } from "@/services/setupAxios";
import Notify from 'notiflix/build/notiflix-notify-aio';
import React, { useState, useEffect } from "react";
import GetUSBDevice from "./get-usb";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const NewDevice = () => {
    const [submitted, setSubmitted] = useState(false);
    const [port, setPort] = useState(null);
    const [deviceCreated, setDeviceCreated] = useState({
        name: "",
        ssid: "",
        pass: "",
        active: false,
        dataID: "",
        dataName: ""
    });

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(deviceCreated);

        await instanceCoreApi.post(`${API}/devices`, deviceCreated).then(async (response) => {
            console.log(response.data);
            Notify.Notify.success(`Device info updated successfully!`);
            if (port) {
                const writer = port.writable.getWriter();
                for (const [key, value] of Object.entries(response.data.data)) {
                 if (key !== "_v" && key !== "createdBy" && key !== "name" && key !== "active") {
                     const keyValue = `${key}:${value}\n`;
                     console.log(keyValue);
                     const data = new TextEncoder().encode(keyValue);
                     await writer.write(data);
                 }
                }
                writer.releaseLock();
                Notify.Notify.success(`Write info to device successfully!`);
            }
            setSubmitted(true);
        }).catch(error => {
            console.error(error);
            setSubmitted(false);
            Notify.Notify.failure(`Error updating new device info: ${error}`);
        })
    };

    const handleReset = () => {
        setDeviceCreated({
            name: "",
            ssid: "",
            pass: "",
            active: false,
            dataID: ""
        })
    }

    return (
        (submitted ? (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <h1>The EPD device is created sucessfully!</h1>
                <br />
                <p>You can see device detail and its display status by going to Dashboard - Devices</p>
                <br />
                <button className="ok" onClick={() => handleReset()}>
                    <Link href="/dashboard/devices">Let&apos;s go!</Link>
                </button>
            </div>
        ) : (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <GetUSBDevice
                    deviceCreated={deviceCreated}
                    setDeviceCreated={setDeviceCreated}
                    port={port}
                    setPort={setPort}
                    handleSubmit={handleSubmit}
                />
            </div>
        ))
    );
};

export default NewDevice;
