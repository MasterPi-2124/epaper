import Image from "next/image";
import Logo from "@/public/logo/cnweb-30.png";
import { Input, Textarea } from "@nextui-org/react";
import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState } from "react"
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API;

const NewClass = () => {
    const [submitted, setSubmitted] = useState(false);
    const [classID, setClassID] = useState(0);
    const [subject, setSubject] = useState("");
    const [semester, setSemester] = useState(0);
    const [totalStudent, setTotalStudent] = useState(0);
    const [description, setDescription] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            codename: classID,
            subject: subject,
            semester: semester,
            studentCount: totalStudent,
            note: description
        }

        console.log(data)
        instanceCoreApi.post(`${API}/classes`, data).then(response => {
            console.log(response.data);
            setSubmitted(true);
        }).catch(error => {
            console.error(error)
            setSubmitted(false);
        })
    };

    const resetState = () => {
        setClassID(0);
        setSubject("");
        setSemester(0);
        setTotalStudent(0);
        setDescription("");
    }

    return (
        (!submitted) ? (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <h1>Create a new Class</h1>
                <Image alt="logo" src={Logo}></Image>
                <form className="form" onSubmit={handleSubmit}>

                    <Input
                        className="input"
                        label="Class ID"
                        min={0}
                        type="number"
                        placeholder="713412"
                        onChange={(e) => setClassID(e.target.value)}
                    />

                    <Input
                        className="input"
                        label="Subject"
                        placeholder="CN Web"
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <Input
                        className="input"
                        label="Semester"
                        min={0}
                        placeholder="20222"
                        type="number"
                        bordered
                        onChange={(e) => setSemester(e.target.value)}
                    />


                    <Input
                        className="input"
                        label="Total Students"
                        placeholder="50"
                        type="number"
                        min={0}
                        bordered
                        onChange={(e) => setTotalStudent(e.target.value)}
                    />


                    <Textarea
                        className="input"
                        label="Description"
                        placeholder="A note here"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {console.log(`Class ID: ${classID}`)}
                    {console.log(`Subject: `, subject)}
                    {console.log(`Semester: `, semester)}
                    {console.log(`Total Student: `, totalStudent)}
                    {console.log(`Description: `, description)}

                    <button type="submit" className="dark:bg-dark-background">Create</button>
                </form>
            </div>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <h1>The class {classID} of subject {subject} is created sucessfully!</h1>
                <br />
                <p>You can see class detail and its quizzes by going to Dashboard - Classes</p>
                <br />
                <button className="ok" onClick={() => resetState()}>
                    <Link href="/dashboard/classes">Let&apos;s go!</Link>
                </button>
            </div>
        )
    );
};

export default NewClass;
