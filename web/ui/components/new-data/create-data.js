import React, { useState, useEffect, useMemo } from "react"
import { Input, Switch, Popover } from "@nextui-org/react";
import Image from "next/image";
import Logo from "@/public/logo/epaper.svg";
import { WheelPicker } from "./WheelPicker";
import dayjs from "dayjs";
import Link from "next/link";
import { Notify } from "notiflix";

const CreateData = ({ dataCreated, setDataCreated, stage, setStage, handleStage, handleReset, handleSubmit }) => {
    const handleChange = (param, e) => {
        let userTyped = {};
        if (param === "active") {
            userTyped[param] = e.target.checked;
        } else {
            userTyped[param] = e.target.value;
        }
        setDataCreated(dataCreated => ({
            ...dataCreated,
            ...userTyped
        }))
    }

    const hourItems = Array.from({ length: 12 }, (_, index) => ({
        value: `${(index + 1).toString().padStart(2, "0")}`,
        label: `${(index + 1).toString().padStart(2, "0")}`
    }));

    const minuteItems = Array.from({ length: 12 }, (_, index) => ({
        value: `${(index * 5).toString().padStart(2, "0")}`,
        label: `${(index * 5).toString().padStart(2, "0")}`
    }));

    const ampmItems = [
        { value: "AM", label: "AM" },
        { value: "PM", label: "PM" }
    ];

    const dateItems = Array.from({ length: 10 }, (_, i) => {
        const date = dayjs().add(0, "days").add(i, "days");
        return {
            value: date.startOf("day").format("YYYY-MM-DD"),
            label: 0 === i ? "Today" : date.format("ddd, DD MMM")
        };
    });

    const [date, setDate] = useState(dateItems[0].value);
    const [hour, setHour] = useState(Math.abs(new Date().getHours() % 12));
    const [minute, setMinute] = useState(new Date().getMinutes() - (new Date().getMinutes() % 5));
    const [ampm, setAmpm] = useState(new Date().getHours() > 12 ? "PM" : "AM");

    useEffect(() => {
        if (dataCreated["active"] === true) {
            let userTyped = {};
            let hr = "";
            if (ampm === "AM") {
                if (hour === "12") {
                    hr = "00";
                } else {
                    hr = hour.toString();
                }
            } else {
                if (hour === "12") {
                    hr = "12";
                } else {
                    hr = (parseInt(hour, 10) + 12).toString();
                }
            }
            const dd = new Date(`${date} ${hr}:${minute}`);
            userTyped["activeStartTime"] = Math.floor(dd.getTime() / 1000);
            setDataCreated(dataCreated => ({
                ...dataCreated,
                ...userTyped
            }))
        }
    }, [date, hour, minute, ampm]);

    return (
        (stage === 0) ? (
            <>
                <h1>Enter information</h1>
                <Image alt="logo" src={Logo}></Image>
                <form className="form">
                    <label className="dark:text-dark-text text-light-text">First, fill in your information to continue</label>
                    <Input
                        className="input"
                        required
                        label="Name"
                        type="text"
                        onChange={(e) => handleChange("name", e)}
                    />
                    {dataCreated.type === "Client" ? (
                        <>
                            <Input
                                className="input"
                                label="Email"
                                required
                                type="email"
                                onChange={(e) => handleChange("email", e)}
                            />

                            <Input
                                className="input"
                                label="Address"
                                required
                                type="text"
                                onChange={(e) => handleChange("input2", e)}
                            />
                        </>
                    ) : dataCreated.type === "Student" ? (
                        <>
                            <Input
                                className="input"
                                required
                                label="Email"
                                type="email"
                                onChange={(e) => handleChange("email", e)}
                            />

                            <Input
                                className="input"
                                label="Student ID"
                                required
                                type="text"
                                onChange={(e) => handleChange("input2", e)}
                            />

                            <Input
                                className="input"
                                label="Class"
                                required
                                type="text"
                                onChange={(e) => handleChange("input3", e)}
                            />
                        </>
                    ) : dataCreated.type === "Product" ? (
                        <>
                            <Input
                                className="input"
                                label="Category"
                                required
                                type="text"
                                onChange={(e) => handleChange("input2", e)}
                            />

                            <Input
                                className="input"
                                label="Price"
                                required
                                type="text"
                                onChange={(e) => handleChange("input3", e)}
                            />
                        </>
                    ) : dataCreated.type === "Employee" ? (
                        <>
                            <Input
                                className="input"
                                label="Email"
                                required
                                type="email"
                                onChange={(e) => handleChange("email", e)}
                            />

                            <Input
                                className="input"
                                label="Employee ID"
                                required
                                type="text"
                                onChange={(e) => handleChange("input2", e)}
                            />

                            <Input
                                className="input"
                                label="Department"
                                required
                                type="text"
                                onChange={(e) => handleChange("input3", e)}
                            />
                        </>
                    ) : (
                        <>
                            <Input
                                className="input"
                                required
                                label="Purpose"
                                type="text"
                                onChange={(e) => handleChange("input2", e)}
                            />

                            <Input
                                className="input"
                                required
                                label="Manager"
                                type="text"
                                onChange={(e) => handleChange("input3", e)}
                            />

                            <Input
                                className="input"
                                label="Status"
                                required
                                type="text"
                                onChange={(e) => handleChange("input4", e)}
                            />
                        </>
                    )}

                    <div className="switch">
                        <label style={{
                            fontSize: "14px",
                        }}
                        >
                            Display on EPD?
                        </label>
                        <Switch
                            className="input"
                            bordered
                            label="EPD display?"
                            onChange={(e) => handleChange("active", e)}
                        />
                    </div>

                    {dataCreated.active ? (
                        <div>
                            <label style={{
                                fontSize: "14px",
                            }}
                            >
                                Active start time
                            </label>
                            <Popover placement="bottom" showArrow>
                                <Popover.Trigger>
                                    <a style={{
                                        width: "100%",
                                        height: "40px",
                                        paddingLeft: "10px",
                                        lineHeight: "40px",
                                        borderRadius: "14px",
                                        backgroundColor: "#7c7c7c44",
                                        fontWeight: "200",
                                        fontSize: "13px",
                                        marginTop: "5px",
                                    }}>
                                        {date} {hour}:{minute} {ampm}
                                    </a>
                                </Popover.Trigger>
                                <Popover.Content>
                                    <WheelPicker
                                        dateItems={dateItems}
                                        dateValue={date}
                                        onDateChange={setDate}
                                        hourItems={hourItems}
                                        hourValue={hour}
                                        onHourChange={setHour}
                                        minuteItems={minuteItems}
                                        minuteValue={minute}
                                        onMinuteChange={setMinute}
                                        ampmItems={ampmItems}
                                        ampmValue={ampm}
                                        onAmpmChange={setAmpm}
                                    />
                                </Popover.Content>
                            </Popover>

                        </div>
                    ) : (
                        <></>
                    )}

                    {dataCreated.active ? (
                        <button type="button" onClick={() => {

                            handleStage();
                            if (dataCreated.name === "") {
                                Notify.warning("You have to provide the name", {
                                    className: "notiflix-warning",
                                });
                            }
                        }}>
                            Continue
                        </button>
                    ) : (
                        <button type="submit" onClick={handleSubmit}>
                            Submit
                        </button>
                    )}
                    <button onClick={() => {
                        setStage(-1);
                        handleReset();
                    }}>Back</button>

                </form>
            </>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <h1>Your data is submitted successfully!</h1>
                <p style={{marginTop: "10px"}}> Your data is saved in the database, but you chose not to display on an EPD device yet.</p>
                <button style={{marginTop:"15px"}} className="ok" onClick={() => {
                    setStage(-1);
                    handleReset();
                }}>
                    <Link href="/dashboard/data">Let&apos;s go!</Link>
                </button>
            </div>
        )
    );
};

export default CreateData;