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

const ClassesDashboard = () => {
    const cookies = new Cookies();
    const [boardsData, setBoardsData] = useState();
    const [token, setToken] = useState(cookies.get("TOKEN"))

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
                {token ? (
                    <>
                        <Menu currentPath={"Dashboard"} />
                        <div className="main-container">
                            <BoardProvider data={boardsData} type="classes">
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

export default ClassesDashboard;