import { instanceCoreApi } from "@/services/setupAxios";
import { useState } from "react"
import CreateData from "./create-data";
import ChooseDevice from "./choose-device";
import DataType from "./data-type";
import { Notify } from "notiflix";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const NewData = () => {
    const [stage, setStage] = useState(-1); // -1 - Choose data type
    //  0 - not submitted
    //  1 - submitted but not active
    //  2 - not submitted and active
    //  3 - submitted and active
    const [dataCreated, setDataCreated] = useState({
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

    const handleStage = () => {
        console.log(dataCreated)
        if (dataCreated.name && dataCreated.name !== "") {
            localStorage.setItem("dataCreated", JSON.stringify(dataCreated));
            if (dataCreated.active && dataCreated.active === true) {
                if (dataCreated.deviceID !== "") {
                    setStage(3);
                } else {
                    setStage(2);
                }
            } else {
                setStage(1);
            }
        } else if (dataCreated.type !== "") {
            setStage(0);
        } else {
            setStage(-1);
        }
    };

    const handleReset = () => {
        setDataCreated({
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(dataCreated);
        if (dataCreated.name === "") {
            Notify.warning("You have to provide the name", {
                className: "notiflix-warning",
            });
        } else if (dataCreated.active && dataCreated.deviceID === "") {
            Notify.warning("You have to choose a display device", {
                className: "notiflix-warning",
            });
        } else {
            Notify.info("Submitting data", {
                className: "notiflix-info",
            });
            await instanceCoreApi.post(`${API}/data`, dataCreated).then(response => {
                console.log(response.data);
                handleStage(event);
                Notify.success("Data submitted and wrote successfully!", {
                    className: "notiflix-success",
                });
            }).catch(error => {
                Notify.failure(`Error submitting data!\n${error}`, {
                    className: "notiflix-failure",
                });
                console.error(error);
            })
        }
    }

    return (
        (stage === -1) ? (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <DataType
                    dataCreated={dataCreated}
                    setDataCreated={setDataCreated}
                    handleStage={handleStage}
                />
            </div>
        ) : (stage === 0 || stage === 1) ? (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <CreateData
                    dataCreated={dataCreated}
                    setDataCreated={setDataCreated}
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
                    dataCreated={dataCreated}
                    setDataCreated={setDataCreated}
                    stage={stage}
                    setStage={setStage}
                    handleReset={handleReset}
                    handleSubmit={handleSubmit}
                />
            </div>
        )
    );
};

export default NewData;