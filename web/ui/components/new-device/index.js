import { instanceCoreApi } from "@/services/setupAxios";
import Notify from 'notiflix/build/notiflix-notify-aio';
import React, { useState } from "react";
import GetUSBDevice from "./get-usb";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const NewDevice = () => {
    const [deviceCreated, setDeviceCreated] = useState({
        name: "",
        ssid: "",
        pass: "",
        active: false,
        userID: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(deviceCreated);

        instanceCoreApi.post(`${API}/devices`, deviceCreated).then(response => {
            console.log(response.data);
            Notify.Notify.success(`Device info updated successfully!`);
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
            userID: ""
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
                    handleSubmit={handleSubmit}
                />
            </div>
        ))
    );
};

export default NewDevice;
