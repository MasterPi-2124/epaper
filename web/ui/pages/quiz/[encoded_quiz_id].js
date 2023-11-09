import Layout from "@/components/layout";
import React, { useState, useEffect } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import StudentQuiz from "@/components/student";
import { decodePath } from "@/services/securePath";

const API = process.env.NEXT_PUBLIC_API;

export async function getServerSideProps(context) {
    let props = {};
    const decodedPath = decodePath(context.params.encoded_quiz_id);
    const [quizID, lat, lon ] = decodedPath.split('/');

    try {
        const { data: { data: quizData } } = await instanceCoreApi.get(`${API}/quizzes/${quizID}`);
        props = {
            quizDetail: quizData,
            classDetail: quizData._class,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon)
        }
    }
    catch (err) {
        console.error(err);
    }

    return {
        props,
    }
}

const QuizForm = (props) => {
    const [IP, setIP] = useState("");
    const [existed, setExisted] = useState();
    const [IDList, setIDList] = useState();

    useEffect(() => {
        if (props.quizDetail.status === "In Progress") {
            instanceCoreApi.get('https://freeipapi.com/api/json', {
            }).then((res) => {
                const { ipAddress } = res.data;
                setIP(ipAddress);
                instanceCoreApi.get(`${API}/quizRecords/${props.quizDetail._id}`).then((response) => {
                    console.log(response.data.data.studentList)
                    const IPList = response.data.data.studentList.map(item => item.ipAddress);
                    const ss = response.data.data.studentList.map(item => item.studentId)
                    console.log(ss);
                    setIDList(response.data.data.studentList.map(item => item.studentId));
                    const II = IPList.find((item) => item === ipAddress);
                    console.log(IP)
                    if (II) setExisted(true)
                    else setExisted(false)
                })
            })
        }
    }, [props])


    return (
        <Layout pageTitle="Quiz | CNWeb-30">
            {console.log(props.quizDetail._id, props.latitude, props.longitude)}
            <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
                <div className="main-container">
                    {Object.keys(props).length > 0 ? (
                        !existed ? (
                            props.quizDetail.status === "In Progress" ? (
                                <StudentQuiz IP={IP} quizDetail={props.quizDetail} classDetail={props.classDetail} checkLat={props.latitude} checkLon={props.longitude} IDList={IDList} />
                            ) : (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}>
                                    <h1 style={{
                                        fontSize: "60px",
                                        fontWeight: "700"
                                    }}>
                                        The party was over!!
                                    </h1>
                                    <p style={{
                                        fontWeight: "100",
                                        fontSize: "20px"
                                    }}>
                                        Sorry late bird, sometimes you have to realize that nothing is eternal, like life, or even this quiz.
                                    </p>
                                </div>
                            )
                        ) : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <h1 style={{
                                    fontSize: "60px",
                                    fontWeight: "700"
                                }}>
                                    Gotcha cheater!!
                                </h1>
                                <p style={{
                                    fontWeight: "100",
                                    fontSize: "20px"
                                }}>
                                    Sorry but we only have one chance to try, and you already wasted it lol.
                                </p>
                            </div>
                        )
                    ) : (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <h1 style={{
                                fontSize: "60px",
                                fontWeight: "700"
                            }}>
                                Oh no!
                            </h1>
                            <p style={{
                                fontWeight: "100",
                                fontSize: "20px"
                            }}>
                                Sorry we can only take you half way there, because the server did not want to talk to us lmao.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default QuizForm;