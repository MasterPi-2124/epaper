import React, { useState, useMemo } from "react"
import { Input, Switch, Popover } from "@nextui-org/react";
import Image from "next/image";
import Logo from "@/public/logo/epaper.svg";
import Link from "next/link";
import { WheelPicker } from "./WheelPicker";
import dayjs from "dayjs";

const CreateUser = ({ userCreated, setUserCreated, stage, handleStage, handleReset, handleSubmit }) => {
    const handleChange = (param, e) => {
        let userTyped = {};
        if (param === "active") {
            userTyped[param] = e.target.checked;
        } else {
            userTyped[param] = e.target.value;
        }
        setUserCreated(userCreated => ({
            ...userCreated,
            ...userTyped
        }))
    }

    const hourItems = Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: index + 1
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
    const [hour, setHour] = useState(Math.abs(new Date().getHours() - 12));
    const [minute, setMinute] = useState(new Date().getMinutes() - (new Date().getMinutes() % 5));
    const [ampm, setAmpm] = useState(new Date().getHours() > 12 ? "PM" : "AM");

    return (
        (stage === 0) ? (
            <>
                <h1>Hi</h1>
                <Image alt="logo" src={Logo}></Image>
                <form className="form" onSubmit={handleStage}>
                    <label className="dark:text-dark-text text-light-text">First, fill in your information to continue</label>
                    <Input
                        className="input"
                        required
                        label="Name"
                        type="text"
                        onChange={(e) => handleChange("name", e)}
                    />

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
                        onChange={(e) => handleChange("address", e)}
                    />

                    <div className="switch">
                        <label>Display on EPD?</label>
                        <Switch
                            className="input"
                            bordered
                            label="EPD display?"
                            onChange={(e) => handleChange("active", e)}
                        />
                    </div>


                    {userCreated.active ? (
                        <div>
                            <label>Active start time</label>
                            <Popover placement="bottom" showArrow>
                                <Popover.Trigger>
                                    <a style={{
                                        width: "100%",
                                        height: "40px",
                                        paddingLeft: "10px",
                                        lineHeight:"40px",
                                        borderRadius: "13px",
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

                    {console.log(`Name: `, userCreated.name)}
                    {console.log(`Email: `, userCreated.email)}
                    {console.log(`Address: `, userCreated.address)}
                    {console.log(`Write on EPD?: `, userCreated.active)}

                    {userCreated.active ? (
                        <button type="button" onClick={handleStage}>
                            Continue
                        </button>
                    ) : (
                        <button type="submit" onClick={handleSubmit}>
                            Submit
                        </button>
                    )}
                </form>
            </>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <h1>Your information is successfully submitted!</h1>
                <br />
                <p> Your personnal information is saved in our database, but you chose not to display it on EPD device yet.</p>
                <button className="ok" onClick={() => handleReset()}>
                    <Link href="/dashboard/users">Let&apos;s go!</Link>
                </button>
            </div>
        )
    );
};

export default CreateUser;