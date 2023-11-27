import Link from "next/link";
import Layout from "@/components/layout";
import Menu from "@/components/dashboard/menu";

import data from "@/assets/data/dashboard.json";
import React, { useState, useEffect } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
// import Dashboard from "@/components/dashboard/dashboard";
// import { BoardProvider } from '@/components/dashboard/context';

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const QuizzesDashboard = () => {

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
            {/* <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
                <Menu currentPath={"Dashboard"} />
                <div className="main-container">
                    <BoardProvider data={boardsData} type="quizzes" >
                        <Dashboard />
                    </BoardProvider>
                </div>
            </div> */}
        </Layout>
    );
}

export default QuizzesDashboard;
