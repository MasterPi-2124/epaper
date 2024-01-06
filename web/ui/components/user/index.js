import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { instanceCoreApi } from "@/services/setupAxios";

const API = process.env.NEXT_PUBLIC_API;

const User = ({ cookies, setToken }) => {
    const router = useRouter();
    const [user, setUser] = useState();

    useEffect(() => {
        const token = cookies.get("TOKEN");
        const payload = token.split(".")[1];
        const decodedToken = atob(payload);
        const { userID } = JSON.parse(decodedToken);
        instanceCoreApi.get(`${API}/user/${userID}`).then((res) => {
            setUser({
                "id": userID,
                "email": res.data.data.email,
                "name": res.data.data.name,
                "gender": res.data.data.gender === 1 ? "Male" : "Female",
            })
        })
    }, [])

    return (
        <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
            {new Date().getHours() < 12 ? (
                <div className="">
                    <h1 className="text-4xl font-bold">Good Morning!</h1>
                    <p className="leading-7 font-thin">Hope you bring pizza!</p>
                </div>
            ) : new Date().getHours() < 18 ? (
                <div className="">
                    <h1 className="text-4xl font-bold">Good Afternoon!</h1>
                    <p className="leading-7 font-thin">How is it going?</p>
                </div>
            ) : (
                <div className="">
                    <h1 className="text-4xl font-bold">Good Evening!</h1>
                    <p className="leading-7 font-thin">How is your day?</p>
                </div>
            )}

            <div className="stats w-full" style={{margin: "20px 0px"}}>
                {console.log(user)}
                <p>Your ID: {user?.id}</p>
                <p>Your Name: {user?.name}</p>
                <p>Your Email: {user?.email}</p>
                <p>Your Gender: {user?.gender}</p>
            </div>

            <button
                className="ok"
                style={{ padding: "10px 50px", transitionDuration: "200ms" }}
                onClick={() => {
                    cookies.remove("TOKEN");
                    setToken(null);
                    router.push('/');
                }}
            >
                Sign Out
            </button>
        </div>
    )
};

export default User;