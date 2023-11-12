import { useEffect, useState } from "react"
import GetLocation from "./get-location";
import GetName from "./get-name";
import GetID from "./get-id";
import GetForm from "./get-form";
import Cookies from "js-cookie";

const StudentQuiz = ({ IP, quizDetail, classDetail, checkLat, checkLon, IDList }) => {
    const [location, setLocation] = useState();
    const [studentName, setStudentName] = useState("");
    const [studentID, setStudentID] = useState();
    const [stage, setStage] = useState(0);
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        const studentLocation = Cookies.get("studentLocation");
        const studentName = Cookies.get("studentName");
        const studentID = Cookies.get("studentID");
        const submit = Cookies.get("submit");

        if (studentLocation) {
            setLocation(JSON.parse(studentLocation));
            if (studentName) {
                setStudentName(JSON.parse(studentName));
                if (studentID) {
                    setStudentID(JSON.parse(studentID));
                    if (submit) {
                        setSubmit(true);
                        setStage(4);
                    } else {
                        setStage(3);
                    }
                } else {
                    setStage(2);
                }
            } else {
                setStage(1);
            }
        } else {
            setStage(0);
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        let date = new Date();
        date.setTime(date.getTime() + (2 * 60 * 1000)); // 2 mins from now
        console.log("stage: ", stage)
        console.log("submit: ", submit)

        if (location) {
            Cookies.set("studentLocation", JSON.stringify(location), { expires: date, secure: true, sameSite: 'strict' });
            if (studentName) {
                Cookies.set("studentName", JSON.stringify(studentName), { expires: date, secure: true, sameSite: 'strict' });
                if (studentID) {
                    Cookies.set("studentID", JSON.stringify(studentID), { expires: date, secure: true, sameSite: 'strict' });
                    if (submit) {
                        Cookies.set("submit", true, { expires: date, secure: true, sameSite: 'strict' });
                        setStage(4);
                        console.log(submit, stage)
                    } else {
                        setStage(3);
                    }
                } else {
                    setStage(2);
                }
            } else {
                setStage(1);
            }
        } else {
            setStage(0);
        }
    };

    return (
        <div className="content">
            {
                (stage === 0) ? (
                    <GetLocation
                        IP={IP}
                        quizDetail={quizDetail}
                        classDetail={classDetail}
                        location={location}
                        checkLat={checkLat}
                        checkLon={checkLon}
                        setLocation={setLocation}
                        handleSubmit={handleSubmit}
                    />
                ) : (stage === 1) ? (
                    <GetName
                        quizDetail={quizDetail}
                        classDetail={classDetail}
                        studentName={studentName}
                        setStudentName={setStudentName}
                        handleSubmit={handleSubmit}
                    />
                ) : (stage === 2) ? (
                    <GetID
                        quizDetail={quizDetail}
                        classDetail={classDetail}
                        studentID={studentID}
                        studentName={studentName}
                        setStudentID={setStudentID}
                        handleSubmit={handleSubmit}
                        IDList={IDList}
                    />
                ) : (stage === 3) ? (
                    <GetForm
                        IP={IP}
                        studentName={studentName}
                        studentID={studentID}
                        quizDetail={quizDetail}
                        classDetail={classDetail}
                        studentLocation={location}
                        submit={submit}
                        setSubmit={setSubmit}
                        handleSubmit={handleSubmit}
                    />
                ) : (stage == 4) ? (
                    <div>
                        Your response has been received.
                    </div>
                ) : (
                    <div>
                        Your response could not be saved.
                    </div>
                )
            }
        </div>
    );
};

export default StudentQuiz;