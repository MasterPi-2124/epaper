import { Notify } from "notiflix";
import { instanceCoreApi } from "@/services/setupAxios";
import React, { useState, useEffect } from 'react';
import DeleteIcon from "@/assets/icons/thick/delete.svg";
import Link from "next/link";
import { Textarea } from '@nextui-org/react';
import Image from "next/image";
import { usePiP } from '@/services/pip';
import { FileInput, Label } from 'flowbite-react';

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const DebugModal = ({ data, onClose }) => {
    const [data1, setData1] = useState();
    const [file, setFile] = useState(null);
    const [ota, setOTA] = useState(false);
    const { isPiPVisible, showPiP, hidePiP, stopPiP, serialData, onConnectSerial } = usePiP();


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFirmware = () => {
        if (!file) {
            Notify.failure('Please select a file to upload', {
                className: "notiflix-failure"
            });
            return;
        }

        const formData = new FormData();
        formData.append('firmware', file);

        instanceCoreApi.post(`/devices/upgrade?device=${data._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            Notify.success('Uploaded firmware successfully!', {
                className: "notiflix-success"
            });
        }).catch(error => {
            Notify.failure(`Error uploading firmware: ${error}`, {
                className: "notiflix-failure"
            });
        });
    }

    useEffect(() => {
        if (data.dataID) {
            instanceCoreApi.get(`${API}/data/${data.dataID}`).then((res) => {
                setData1(res.data.data);
            }).catch((error) => {
                Notify.failure(`Error fetching data: ${error}`, {
                    className: "notiflix-failure"
                });
                console.log(error)
                setData1();
            })
        }
    }, [])

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
                        </>
                    ) : (
                        <>
                            The device currently has no data to display. Go to <Link href="/dashboard/data"> data dashboard</Link> to select data to display, or create a new data <Link href="/new-data">here</Link>.
                        </>
                    )}
                </div>

                <div className="flex gap-4 modal-footer">
                    <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200 edit-button ok" onClick={() => setOTA(false)}>
                        Show log (debug)
                    </button>
                    <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200 edit-button ok" onClick={() => setOTA(true)}>
                        OTA upgrade
                    </button>
                </div>
            </div>

            <div className="separator w-0.5" />

            <div className='debug-right'>
                {ota ? (
                    <>
                        <h1>Upload Firmware</h1>

                        <Label
                            className="drag-file-area flex h-30 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
                        >
                            {file ? <>
                                <h3>Your file is ready!</h3>
                                <p>{file.name}</p>
                                <button
                                    className="small-icon"
                                    onClick={() => setFile(null)}
                                >
                                    <Image
                                        src={DeleteIcon}
                                        alt="vertical ellipsis"
                                    />
                                </button>
                            </> : <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                <svg
                                    className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLineJoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Only accept .bin files</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Maximum size: 2.6Mb</p>
                            </div>
                            }

                            <FileInput id="dropzone-file" className="hidden" accept=".bin" onChange={handleFileChange} />
                        </Label>
                        <button onClick={uploadFirmware} className="ok edit-button w-full">Upload</button>
                    </>
                ) : serialData ? (
                    <>
                        <Textarea
                            value={serialData}
                            readOnly
                            fullWidth
                            maxRows={10}
                        />
                        {isPiPVisible ?
                            <button className="edit-button ok w-full" onClick={hidePiP}>Hide PiP</button>
                            :
                            <button
                                className="edit-button ok w-full" onClick={() => {
                                    showPiP();
                                    onClose();
                                }}
                            >
                                Show PiP
                            </button>
                        }
                        <button className="delete-button ok w-full" onClick={stopPiP}>Disconnect</button>
                    </>
                ) : (
                    <button onClick={onConnectSerial} className='ok edit-button'>Connect via Serial Port</button>
                )}
            </div>
        </div>
    )
}

export default DebugModal
