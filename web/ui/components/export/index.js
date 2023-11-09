import React, { useState, useEffect } from "react";
import { Dropdown } from "@nextui-org/react";
import { instanceCoreApi } from "@/services/setupAxios";
import * as XLSX from "xlsx";

const API = process.env.NEXT_PUBLIC_API;

const Export = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quiz, setQuiz] = useState("");

    useEffect(() => {
        instanceCoreApi.get(`${API}/quizzes`).then(res => {
            setQuizzes(res.data.data);
        }).catch(err => {
            console.error(err);
        })
    }, []);

    const handleExport = (event) => {
        event.preventDefault();
        if (quiz !== "") {
            getResponses(quiz)
        }
    }

    const getResponses = (quizID) => {
        instanceCoreApi.get(`${API}/quizRecords/${quizID}`).then(res => {
            const list = res.data.data.studentList;
            const worksheet = XLSX.utils.json_to_sheet(list);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            const downloadUrl = URL.createObjectURL(data);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${quizID}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }

    return (
        <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
            <form className="form" onSubmit={handleExport}>
                <label>Choose a quiz to export</label>
                <Dropdown>
                    <Dropdown.Button flat className="classes-choices">
                        {quiz ? quiz : 'Choose a quiz'}
                    </Dropdown.Button>
                    <Dropdown.Menu
                        aria-label="Single selection actions"
                        color="primary"
                        items={quizzes}
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={quiz}
                    >
                        {quizzes?.map((data) => {
                            return <Dropdown.Item key={data._id}>
                                <button
                                    onClick={() => {
                                        setQuiz(data._id);
                                    }}
                                    style={{
                                        padding: "10px 0px"
                                    }}
                                    className="w-full dropdown-item"
                                >
                                    <p style={{
                                        textAlign: "left",
                                        color: "white"
                                    }}
                                    >
                                        {data._id}
                                    </p>
                                    <p style={{
                                        textAlign: "left",
                                        color: "rgb(177, 177, 177)",
                                        fontSize: "10px"
                                    }}
                                    >
                                        Class ID: {data._class.codename}
                                    </p>
                                </button>
                            </Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                <button className="dark:bg-dark-background" type="submit">Export</button>
            </form>
        </div>
    )
};

export default Export;