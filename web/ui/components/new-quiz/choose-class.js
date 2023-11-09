import { instanceCoreApi } from "@/services/setupAxios";
import React, { useEffect, useState, useMemo } from "react";
import { Dropdown } from "@nextui-org/react";
import Image from "next/image";
import Logo from "@/public/logo/cnweb-30.png";

const API = process.env.NEXT_PUBLIC_API;

const ChooseClass = ({ classSelected, setClassSelected, handleSubmit }) => {
    const [classes, setClasses] = useState()
    const selectedValue = useMemo(() => classSelected.className, [classSelected]);

    const getClasses = async () => {
        try {
            await instanceCoreApi.get(`${API}/classes`).then((res) => {
                setClasses(res.data.data)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getClasses();
    });

    return (
        <>
            <h1>Create a new quiz</h1>
            <Image alt="logo" src={Logo}></Image>
            <form className="form" onSubmit={handleSubmit}>
                <label className="dark:text-dark-text text-light-text">First, choose a class to start</label>
                <Dropdown>
                    <Dropdown.Button flat className="classes-choices">
                        {selectedValue ? selectedValue : 'Choose a class'}
                    </Dropdown.Button>
                    <Dropdown.Menu
                        aria-label="Single selection actions"
                        color="primary"
                        items={classes}
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={classSelected.classID}
                    >
                        {classes?.map((data) => {
                            return <Dropdown.Item key={data.subject}>
                                <button
                                    onClick={() => setClassSelected({
                                        classID: data._id,
                                        className: data.subject,
                                        codename: data.codename
                                    })}
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
                                        {data.subject}
                                    </p>
                                    <p style={{
                                        textAlign: "left",
                                        color: "rgb(177, 177, 177)",
                                        fontSize: "10px"
                                    }}
                                    >
                                        Class ID: {data.codename} - {data.semester}
                                    </p>
                                </button>
                            </Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                <button className="dark:bg-dark-background" type="submit">Continue</button>
            </form>
        </>
    );
};

export default ChooseClass;
