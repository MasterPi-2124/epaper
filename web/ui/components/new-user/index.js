import { instanceCoreApi } from "@/services/setupAxios";
import { useEffect, useState } from "react"
import CreateUser from "./create-user";
import ChooseDevice from "./choose-device";
import UserType from "./user-type";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const NewUser = () => {
    const [stage, setStage] = useState(-1); // -1 - Choose user type
    //  0 - not submitted
    //  1 - submitted but not active
    //  2 - not submitted and active
    //  3 - submitted and active
    const [userCreated, setUserCreated] = useState({
        type: "",
        name: "",
        active: false,
        activeTimestamp: [],
        activeStartTime: -1,
        deviceID: "",
        deviceName: "",
        fontStyle: "",
        designSchema: ""
    });

    const handleStage = (event) => {
        event.preventDefault();
        console.log(userCreated)
        if (userCreated.name && userCreated.name !== "") {
            localStorage.setItem("userCreated", JSON.stringify(userCreated));
            if (userCreated.active && userCreated.active === true) {
                if (userCreated.deviceID !== "") {
                    setStage(3);
                } else {
                    setStage(2);
                }
            } else {
                setStage(1);
            }
        } else if (userCreated.type !== "") {
            setStage(0);
        } else {
            setStage(-1);
        }
    };

    const handleReset = () => {
        setUserCreated({
            type: "",
            name: "",
            active: false,
            activeTimestamp: [],
            activeStartTime: -1,
            deviceID: "",
        deviceName: "",
        fontStyle: "",
            designSchema: ""
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(userCreated);
        instanceCoreApi.post(`${API}/users`, userCreated).then(response => {
            console.log(response.data);
            handleStage(event);
        }).catch(error => {
            console.error(error);
        })
    }

    return (
        (stage === -1) ? (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <UserType
                    userCreated={userCreated}
                    setUserCreated={setUserCreated}
                    handleStage={handleStage}
                />
            </div>
        ) : (stage === 0 || stage === 1) ? (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <CreateUser
                    userCreated={userCreated}
                    setUserCreated={setUserCreated}
                    stage={stage}
                    setStage={setStage}
                    handleStage={handleStage}
                    handleReset={handleReset}
                    handleSubmit={handleSubmit}
                />
            </div>
        ) : (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <ChooseDevice
                    userCreated={userCreated}
                    setUserCreated={setUserCreated}
                    stage={stage}
                    setStage={setStage}
                    handleReset={handleReset}
                    handleSubmit={handleSubmit}
                />
            </div>
        )
    );
};

export default NewUser;