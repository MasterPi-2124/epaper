import React, { useState, useEffect } from "react"
import { instanceCoreApi } from "@/services/setupAxios";

const API = process.env.NEXT_PUBLIC_API

const GetForm = ({ IP, studentName, studentID, quizDetail, classDetail, studentLocation, submit, setSubmit, handleSubmit }) => {
    const [ready, setReady] = useState(false);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        if (quizDetail.formLink === "") {
            console.log(quizDetail.formLink)
            const fakeEvent = {
                preventDefault: () => { },
                target: null,
            }
            console.log("submit", submit);
            handleClick(fakeEvent);
        }
    }, [quizDetail.formLink]);

    useEffect(() => {
        if (submit && event) {
            console.log(event);
            handleSubmit(event);
        }
    }, [submit, event]); // eslint-disable-next-line react-hooks/exhaustive-deps

    const handleClick = (event) => {
        event.preventDefault();
        const data = {
            studentId: studentID,
            studentName: studentName,
            ipAddress: IP
        }
        console.log(data)
        instanceCoreApi.put(`${API}/quizRecords/${quizDetail._id}`, data).then(response => {
            console.log(response.data);
            setSubmit(true);
            setEvent(event);
        }).catch(error => {
            console.error(error);
            setSubmit(false);
        })
    }

    return (
        quizDetail.formLink !== "" ? (
            ready ? (
                <>
                    <h1>Welcome to Class {classDetail.codename}!</h1>
                    <p>Subject: {classDetail.subject} - {classDetail.semester}</p>
                    <br />
                    <br />
                    <iframe src={quizDetail.formLink} width="1000" height="1400-" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
                    <br />
                    <button className="ok" style={{ padding: "10px 50px", transitionDuration: "200ms" }} onClick={handleClick} type="submit">
                        Finish
                    </button>
                </>
            ) : (
                <>
                    {console.log(quizDetail)}
                    <h1>Welcome to Class {classDetail.codename}!</h1>
                    <p>Subject: {classDetail.subject} - {classDetail.semester}</p>
                    <p>
                        You will enter the quiz. Finish the quiz first and then press &apos;Finish&apos; button to submit.
                    </p>
                    <br />
                    <h3>----------------------</h3>
                    <div>
                        <p>Your Name: {studentName}</p>
                        <p>Your ID: {studentID}</p>
                        <p>Your location: ({studentLocation.latitude}, {studentLocation.longitude})</p>
                    </div>
                    <br />

                    <button className="ok" style={{ padding: "10px 50px", transitionDuration: "200ms" }} onClick={() => setReady(true)}>
                        Ready
                    </button>
                </>
            )
        ) : (
            <>Thank you</>
        )
    );
};

export default GetForm;