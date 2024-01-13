import { Notify } from "notiflix";
import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Textarea } from '@nextui-org/react';
import { usePiP } from '@/services/pip';


const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const DebugModal = ({ data, onClose }) => {
    const [data1, setData1] = useState();
    const { showPiP, hidePiP, stopPiP, serialData, onConnectSerial } = usePiP();

    useEffect(() => {
        if (data.dataID) {
            instanceCoreApi.get(`${API}/data/${data.dataID}`).then((res) => {
                setData1(res.data.data);
            }).catch((error) => {
                Notify.failure(`Error fetching data: ${error}`);
                console.log(error)
                setData1();
            })
        }
    })

    return (
        <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8 flex flex-row">
            <div className='detail-left'>
                <div className="modal-heading flex items-left justify-between mb-6 flex-row" >
                    <div>
                        <h1 className="heading-lg">{data.name}</h1>
                        <p className="heading-lg">{data._id}</p>
                    </div>
                </div>

                <div className="stats">
                    <h1>Data information</h1>
                    {data1 ? (
                        <>
                            <p style={{ marginBottom: "10px" }}>Here is the data information displayed on the device:</p>
                            <p className="body-lg text-mediumGrey">
                                - Name: <strong>{data1.name}</strong>
                            </p>
                            <p className="body-lg">
                                - Type: <strong>{data1.type}</strong>
                            </p>
                            {data1.type === "Client" ? (
                                <>
                                    <p>
                                        - Email: <strong>{data1.email}</strong>
                                    </p>
                                    <p>
                                        - Address: <strong>{data1.input2}</strong>
                                    </p>
                                </>
                            ) : data1.type === "Student" ? (
                                <>
                                    <p>
                                        - Email: <strong>{data1.email}</strong>
                                    </p>
                                    <p>
                                        - Student ID: <strong>{data1.input2}</strong>
                                    </p>
                                    <p>
                                        - Class: <strong>{data1.input3}</strong>
                                    </p>
                                </>
                            ) : data1.type === "Product" ? (
                                <>
                                    <p>
                                        - Category: <strong>{data1.input2}</strong>
                                    </p>
                                    <p>
                                        - Price: <strong>{data1.input3}</strong>
                                    </p>
                                </>
                            ) : data1.type === "Employee" ? (
                                <>
                                    <p>
                                        - Email: <strong></strong>{data1.email}
                                    </p>
                                    <p>
                                        - Employee ID: <strong>{data1.input2}</strong>
                                    </p>
                                    <p>
                                        - Department: <strong>{data1.input3}</strong>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        - Purpose: <strong>{data1.input2}</strong>
                                    </p>
                                    <p>
                                        - Manager: <strong>{data1.input3}</strong>
                                    </p>
                                    <p>
                                        - Status: <strong>{data1.input4}</strong>
                                    </p>
                                </>
                            )}
                            <div className="separator" />
                            <p>
                                Start Time: {data1.activeStartTime}
                            </p>
                            <p>
                                TimeStamp: {data1.activeTimestamp}
                            </p>
                        </>
                    ) : (
                        <>
                            The device currently has no data to display. Go to <Link href="/dashboard/data"> data dashboard</Link> to select data to display, or create a new data <Link href="/new-data">here</Link>.
                        </>
                    )}
                </div>

                <div className="flex gap-4 modal-footer">
                    <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200 edit-button ok" onClick={() => switchToEdit()}>
                        Reset
                    </button>
                    <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200 delete-button ok" onClick={() => switchToDelete()}>
                        Re-flash
                    </button>
                </div>
            </div>

            <div className="separator w-1" />

            <div className='debug-right'>
                {serialData ? (
                    <>
                <Textarea
                    value={serialData}
                    readOnly
                    fullWidth
                    maxRows={10}
                />
                        <div>
                            <button 
                                onClick={() => {
                                    showPiP();
                                    onClose();
                                }}
                            >
                                Show PiP
                            </button>
                            <button onClick={hidePiP}>Hide PiP</button>
                            <button onClick={stopPiP}>Stop PiP</button>
                        </div>
                    </>
                ) : (
                    <button onClick={onConnectSerial} className='ok edit-button'>Connect via Serial Port</button>
                )}
            </div>
        </div>
    )
}

export default DebugModal
