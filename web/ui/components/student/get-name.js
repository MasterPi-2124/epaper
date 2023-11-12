import React from "react"
import { Input } from "@nextui-org/react";

const GetName = ({ classDetail, setStudentName, handleSubmit }) => {
    return (
        <>
            <h1>Welcome to Class {classDetail.codename}!</h1>
            <p>{classDetail.subject} - {classDetail.semester}</p>
            <br />
            <form className="form" onSubmit={handleSubmit} style={{ alignItems: "center", maxWidth: "unset" }}>
                <p style={{ fontSize: "20px", marginTop: "10px" }}>What&apos;s your full name?</p>
                <Input
                    className="input"
                    required
                    width="300px"
                    onChange={(e) => setStudentName(e.target.value)}
                />
                <button className="ok" style={{ padding: "10px 50px", transitionDuration: "200ms" }} type="submit">
                    Continue
                </button>
            </form>
        </>
    );
};

export default GetName;