import Link from "next/link";
import Layout from "@/components/layout";
import Menu from "@/components/dashboard/menu";

import data from "@/assets/data/dashboard.json";
import React, { useState, useEffect } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import Dashboard from "@/components/dashboard/dashboard";
import { BoardProvider } from '@/components/dashboard/context';

const API = process.env.NEXT_PUBLIC_API;

const ClassesDashboard = () => {
    const [boardsData, setBoardsData] = useState();

    useEffect(() => {
        try {
            instanceCoreApi.get(`${API}/classes?groupBy=semester`).then((res) => {
                let classes = [];
                let columns = [];
                res.data.data.map((semester, id) => {
                    semester._classes.map(item => {
                        classes.push(item);
                    })
                    columns.push({
                        "name": semester.semester,
                        "color": "#123456",
                        "items": semester._classes.map(item => item._id)
                    })
                })
                data.boards.classes.items = classes;
                data.boards.classes.columns = columns;
                setBoardsData(data);

            })
        }
        catch (err) {
            console.error(err);
        }
    }, []);

    console.log(boardsData)
    return (
        <Layout pageTitle="Classes | CNWeb">
            <div className="dashboard bg-[#212121] h-screen bg-center bg-cover bg-no-repeat flex items-center">
                <Menu currentPath={"Dashboard"} />
                <div className="main-container">
                    <BoardProvider data={boardsData} type="classes">
                        <Dashboard />
                    </BoardProvider>
                </div>
            </div>
        </Layout>
    );
}

export default ClassesDashboard;