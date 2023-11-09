import Link from "next/link";
import Cookies from "universal-cookie";
import Layout from "@/components/layout";
import Menu from "@/components/dashboard/menu";
import validToken from "@/services/validToken";
import data from "@/assets/data/dashboard.json";
import React, { useState, useEffect } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import Dashboard from "@/components/dashboard/dashboard";
import { BoardProvider } from '@/components/dashboard/context';

const API = process.env.NEXT_PUBLIC_API;

const QuizzesDashboard = () => {
    const cookies = new Cookies();
    const [boardsData, setBoardsData] = useState();
    const [token, setToken] = useState(cookies.get("TOKEN"));

    useEffect(() => {
        const token = cookies.get("TOKEN");
        if (validToken(token)) {
            setToken(token);
        } else {
            setToken(null);
        }

    }, [token]);

    useEffect(() => {
        try {
            instanceCoreApi.get(`${API}/quizzes/`).then((res) => {
                data.boards.quizzes.items = res.data.data;
                data.boards.quizzes.columns.map((column, i) => {
                    let temp = [];
                    res.data.data.map((item, j) => {
                        if (column.name === item.status) {
                            temp.push(item._id);
                        }
                    })
                    column.items = temp;
                })
                setBoardsData(data);
            })
        }
        catch (err) {
            console.error(err);
        }
    }, [])

    console.log(boardsData)
    return (
        <Layout pageTitle="Quizzes | CNWeb">
            <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
                {token ? (
                    <>
                        <Menu currentPath={"Dashboard"} />
                        <div className="main-container">
                            <BoardProvider data={boardsData} type="quizzes" >
                                <Dashboard />
                            </BoardProvider>
                        </div>
                    </>
                ) : (
                    <div className="main-container">
                        <div className="content">
                            <p>You are not logged in. Please log in to continue.</p>
                            <button className="ok mt-5">
                                <Link href="/login">Log In</Link>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default QuizzesDashboard;
