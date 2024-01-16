import React from "react"
import Image from "next/image";
import Client from "@/assets/icons//thin/client.svg";
import Product from "@/assets/icons//thin/product.svg";
import Employee from "@/assets/icons//thin/employee.svg";
import Room from "@/assets/icons//thin/room.svg";
import Student from "@/assets/icons//thin/student.svg";
import { Notify } from "notiflix";

const DataType = ({ dataCreated, setDataCreated, handleStage }) => {
    const handleChange = (param, value) => {
        let userTyped = {};
        userTyped[param] = value;
        console.log(userTyped)
        setDataCreated(dataCreated => ({
            ...dataCreated,
            ...userTyped
        }))
        console.log(dataCreated)
    }

    const handleContinue = (e) => {
        if (dataCreated.type !== "") {
            handleStage();
        } else {
            Notify.failure("You have to choose an data type to continue.")
        }
    }

    return (
        <>
            <h1>What is your data type?</h1>
            <div className="data-types">
                <div className="type-flip-container">
                    <div className="type-flip">
                        <div className="front-flip">
                            <Image className="data-type-image" src={Product} alt="product" />
                            <p>Product</p>
                        </div>

                        <div className="back-flip">
                            <h3>Product&apos;s name, type and prices</h3>
                            <p>{"(Storage, Markets, ...)"}</p>
                            <button className="ok" onClick={() => handleChange("type", "Product")}>Choose</button>
                        </div>
                    </div>
                </div>


                <div className="type-flip-container">
                    <div className="type-flip">
                        <div className="front-flip">
                            <Image className="data-type-image" src={Student} alt="student" />
                            <p>Student</p>
                        </div>

                        <div className="back-flip">
                            <h3>Student&apos;s name, ID and class</h3>
                            <p>{"(Schools, Universities, ...)"}</p>
                            <button className="ok" onClick={() => handleChange("type", "Student")}>Choose</button>
                        </div>
                    </div>
                </div>

                <div className="type-flip-container">
                    <div className="type-flip">
                        <div className="front-flip">
                            <Image className="data-type-image" src={Employee} alt="employee" />
                            <p>Employee</p>
                        </div>

                        <div className="back-flip">
                            <h3>Employee&apos;s name, ID and deparment</h3>
                            <p>{"(Business, Companies, ...)"}</p>
                            <button className="ok" onClick={() => handleChange("type", "Employee")}>Choose</button>
                        </div>
                    </div>
                </div>

                <div className="type-flip-container">
                    <div className="type-flip">
                        <div className="front-flip">
                            <Image className="data-type-image" src={Client} alt="client" />
                            <p>Client</p>
                        </div>

                        <div className="back-flip">
                            <h3>General Client information</h3>
                            <p>{"(Exhibition, Events, Shops, ...)"}</p>
                            <button className="ok" onClick={() => handleChange("type", "Client")}>Choose</button>
                        </div>
                    </div>
                </div>

                <div className="type-flip-container">
                    <div className="type-flip">
                        <div className="front-flip">
                            <Image className="data-type-image" src={Room} alt="room" />
                            <p>Room</p>
                        </div>

                        <div className="back-flip">
                            <h3>Room number, status, people</h3>
                            <p>{"(Hospitals, Companies, ...)"}</p>
                            <button className="ok" onClick={() => handleChange("type", "Room")}>Choose</button>
                        </div>
                    </div>
                </div>
            </div>
            <button className="ok" onClick={handleContinue}>Continue</button>
        </>
    );
};

export default DataType;