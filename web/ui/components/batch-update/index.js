import React, { useState } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import * as XLSX from "xlsx";
import DeleteIcon from "@/assets/icons/thick/delete.svg";
import { FileInput, Label } from 'flowbite-react';
import Image from "next/image";
import { Notify } from "notiflix";
import { diffChars } from "diff";
import { Button } from "@nextui-org/react";

const BatchUpdate = () => {
    const [file, setFile] = useState(null);
    const [fileReady, setFileReady] = useState(0);
    const [buttonLabel, setButtonLabel] = useState('Accept all and Update');
    const [isUpdating, setIsUpdating] = useState(false);
    const [final, setFinal] = useState([]);
    const [item, setItem] = useState();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSelectedRow = (item) => {
        setItem(item);
    }

    const batchUpdate = async () => {
        setIsUpdating(true);
        const data = final.filter(item => item.action !== "INVALID")
        console.log(data)
        setButtonLabel(`Updated 0/${data.length} data...`);

        data.map((item, index) => {
            if (item.action === "CREATE") {
                instanceCoreApi.post(`/data`, item.data).then(res => {
                    console.log(res)
                    if (index + 1 === data.length) {
                        setButtonLabel(`All data updated successfully!`);
                        setIsUpdating(false);
                        Notify.success('All data updated successfully!', {
                            className: "notiflix-success"
                        });
                    } else {
                        setButtonLabel(`Created ${index + 1}/${data.length} data...`);
                    }
                })
            } else if (item.action === "EDIT") {
                instanceCoreApi.put(`/data/${item.data._id}`, item.data).then(res => {
                    console.log(res)
                    if (index + 1 === data.length) {
                        setButtonLabel(`All data updated successfully!`);
                        setIsUpdating(false);
                        Notify.success('All data updated successfully!', {
                            className: "notiflix-success"
                        });
                    } else {
                        setButtonLabel(`Updated ${index + 1}/${data.length} data...`);
                    }
                })
            }
        });
    }

    const readExcelFile = () => {
        if (!file) {
            Notify.warning('Please select a file to upload', {
                className: "notiflix-warning"
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
            const validKeys = ['_id', 'type', 'name', 'email', 'input2', 'input3', 'input4', 'active', 'deviceID', 'fontStyle', 'designSchema'];
            const isValid = headers.every((header) => validKeys.includes(header));

            if (isValid) {
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                validate(jsonData);
            } else {
                Notify.warning(`This is not a valid data file`, {
                    className: "notiflix-warning"
                })
            }
        };
        reader.readAsBinaryString(file);
    };

    const validate = async (data) => {
        const types = ["Student", "Client", "Employee", "Room", "Product"];
        const fonts = ["Monospace 12pt", "Monospace 16pt", "Monospace 20pt", "Segoe UI Light, 11pt", "Segoe UI Bold, 11pt", "Segoe UI Light, 16pt", "Segoe UI Bold, 16pt", "Segoe UI Light, 20pt"];
        const themes = ["Theme 1", "Theme 2"];
        let data1 = data;

        for (const item of data) {
            console.log(item)
            if (types.includes(item.type)) {
                if (fonts.includes(item.fontStyle)) {
                    if (themes.includes(item.designSchema)) {
                        if (typeof item.active === "boolean") {
                            if ((item.active && item.deviceID === "") || (item.active && !item.deviceID)) {
                                Notify.warning(`Item ${item.name} must have a device to display!`, {
                                    className: "notiflix-warning"
                                })
                                setFinal(final => ([
                                    ...final,
                                    {
                                        id: item.name,
                                        action: "INVALID",
                                        detail: (
                                            <div className="validate-error">
                                                <h4>This item doesn&apos;t have a display device!</h4>
                                                <p>If the active status is True, a display device is required to display the data.</p>
                                            </div>
                                        )
                                    }
                                ]))
                                data1 = data1.filter(i => i !== item)
                            }
                        } else {
                            Notify.warning(`Status ${item.active} of item ${item.name} is not valid!`, {
                                className: "notiflix-warning"
                            })
                            setFinal(final => ([
                                ...final,
                                {
                                    id: item.name,
                                    action: "INVALID",
                                    detail: (
                                        <div className="validate-error">
                                            <h4>This item has an invalid display status!</h4>
                                            <p>Expected status in boolean format, got &quot;{item.active}&quot;.</p>
                                        </div>
                                    )
                                }
                            ]))
                            data1 = data1.filter(i => i !== item)
                        }
                    } else {
                        Notify.warning(`Theme ${item.designSchema} of item ${item.name} is not valid!`, {
                            className: "notiflix-warning"
                        })
                        setFinal(final => ([
                            ...final,
                            {
                                id: item.name,
                                action: "INVALID",
                                detail: (
                                    <div className="validate-error">
                                        <h4>This item has an invalid theme!</h4>
                                        <p>Got unsupported theme &quot;{item.designSchema}&quot;. Expected: </p>
                                        <p> - Theme 1</p>
                                        <p> - Theme 2</p>
                                    </div>
                                )
                            }
                        ]))
                        data1 = data1.filter(i => i !== item)
                    }
                } else {
                    Notify.warning(`Font ${item.fontStyle} of item ${item.name} is not valid!`, {
                        className: "notiflix-warning"
                    })
                    setFinal(final => ([
                        ...final,
                        {
                            id: item.name,
                            action: "INVALID",
                            detail: (
                                <div className="validate-error">
                                    <h4>This item has an invalid font!</h4>
                                    <p>Got unsupported font: &quot;{item.fontStyle}&quot;. Expected:</p>
                                    <p> - Monospace 12pt</p>
                                    <p> - Monospace 16pt</p>
                                    <p> - Monospace 20pt</p>
                                    <p> - Segoe UI Light, 11pt</p>
                                    <p> - Segoe UI Bold, 11pt</p>
                                    <p> - Segoe UI Light, 16pt</p>
                                    <p> - Segoe UI Bold, 16pt</p>
                                    <p> - Segoe UI Light, 20pt</p>
                                </div>
                            )
                        }
                    ]))
                    data1 = data1.filter(i => i !== item)
                }
            } else {
                Notify.warning(`Type ${item.type} of item ${item.name} is not valid!`, {
                    className: "notiflix-warning"
                })
                setFinal(final => ([
                    ...final,
                    {
                        id: item.name,
                        action: "INVALID",
                        detail: (
                            <div className="validate-error">
                                <h4>This item has an invalid font!</h4>
                                <p>Got unsupported font: &quot;{item.type}&quot;. Expected:</p>
                                <p> - Client</p>
                                <p> - Student</p>
                                <p> - Room</p>
                                <p> - Product</p>
                                <p> - Employee</p>
                            </div>
                        )
                    }
                ]))
                data1 = data1.filter(i => i !== item)
            }
        };

        await instanceCoreApi.get('/data').then(async (res) => {
            const currentData = new Map(res.data.data.map(item => [item._id, item]));
            await instanceCoreApi.get('/devices').then((res) => {
                const devices = new Map(res.data.data.map(device => [device._id, device]));
                console.log(data1)
                data1.forEach(item => {
                    if (item.active && item.deviceID && item.deviceID !== "") {
                        const device = devices.get(item.deviceID);
                        if (device) {
                            if (!device.active) {
                                console.log(`Inactive device: ${item.deviceID}. Setting item.active to false for item ${item._id}`);
                                item.active = false; // Update item.active
                                item.deviceID = ""; // Update item.active
                                item.deviceName = ""; // Update item.active
                            } else {
                                item.deviceName = device.name; // Update item.active
                            }
                        } else {
                            item.checked = true;
                            Notify.warning(`Wrong device: ${item._id} has invalid deviceID ${item.deviceID}`, {
                                className: "notiflix-warning"
                            });
                            setFinal(final => ([
                                ...final,
                                {
                                    id: item.name,
                                    action: "INVALID",
                                    detail: (
                                        <div className="validate-error">
                                            <h4>Can not find the display device of the item!</h4>
                                            <p>The device &quot;{item.deviceID}&quot; is not found in the server</p>
                                        </div>
                                    )
                                }
                            ]))
                        }
                    }

                    // Check if item is new
                    if (!item.checked) {
                        if (!currentData.has(item._id)) {
                            console.log(`CREATE item: ${item._id}`);

                            setFinal(final => ([
                                ...final,
                                {
                                    id: item.name,
                                    action: "CREATE",
                                    detail: (
                                        <div className="validate-create">
                                            <h4>This item will be created:</h4>
                                            <p>Type: {item.type}</p>
                                            <p>Name: {item.name}</p>
                                            <p>Email: {item?.email}</p>
                                            <p>Input2: {item?.input2}</p>
                                            <p>Input3: {item?.input3}</p>
                                            <p>Input4: {item?.input4}</p>
                                            <p>Display: {item.active ? item.deviceName : "No"}</p>
                                        </div>
                                    ),
                                    data: item
                                }
                            ]))
                        } else {
                            console.log(`EDIT item: ${item._id}`);
                            const oldData = currentData.get(item._id);
                            if (oldData.type !== item.type) {
                                Notify.warning(`Can not change type ${oldData.type} of device: ${item._id} to new type ${item.type}!`, {
                                    className: "notiflix-warning"
                                });
                                setFinal(final => ([
                                    ...final,
                                    {
                                        id: item.name,
                                        action: "INVALID",
                                        detail: (
                                            <div className="validate-error">
                                                <h4>Item&apos;s type must not be changed!</h4>
                                                <p>Can not change type &quot;{oldData.type}&quot; to new type &quot;{item.type}&quot;. If you want to change the type, remove the item and re-create it again with the new type &quot;{item.type}&quot;.</p>
                                            </div>
                                        ),
                                    }
                                ]))
                            } else {
                                const diffName = diffChars(oldData.name, item.name);
                                const diffEmail = item.email ? diffChars(oldData.email, item.email) : "";
                                const diffInput2 = diffChars(oldData.input2, item.input2);
                                const diffInput3 = item.input3 ? diffChars(oldData.input3, item.input3) : "";
                                const diffInput4 = item.input4 ? diffChars(oldData.input4, item.input4) : "";

                                setFinal(final => ([
                                    ...final,
                                    {
                                        id: item.name,
                                        action: "EDIT",
                                        detail: (
                                            <div className="validate-edit">
                                                <h4>This item will be updated:</h4>
                                                <p>
                                                    {diffName.map((part) => {
                                                        const color = part.added ? 'green' : part.removed ? 'red' : 'transparent';
                                                        return <span key={""} style={{ backgroundColor: color }}>{part.value}</span>
                                                    })}
                                                </p>

                                                <p>{item.type}</p>

                                                {item.email ? (
                                                    <p>
                                                        {diffEmail.map((part) => {
                                                            const color = part.added ? 'green' : part.removed ? 'red' : 'transparent';
                                                            return <span key={""} style={{ backgroundColor: color }}>{part.value}</span>
                                                        })}
                                                    </p>
                                                ) : (<></>)}

                                                <p>
                                                    {diffInput2.map((part) => {
                                                        const color = part.added ? 'green' : part.removed ? 'red' : 'transparent';
                                                        return <span key={""} style={{ backgroundColor: color }}>{part.value}</span>
                                                    })}
                                                </p>

                                                {item.input3 ? (
                                                    <p>
                                                        {diffInput3.map((part) => {
                                                            const color = part.added ? 'green' : part.removed ? 'red' : 'transparent';
                                                            return <span key={""} style={{ backgroundColor: color }}>{part.value}</span>
                                                        })}
                                                    </p>
                                                ) : (<></>)}

                                                {item.input4 ? (
                                                    <p>
                                                        {diffInput4.map((part) => {
                                                            const color = part.added ? 'green' : part.removed ? 'red' : 'transparent';
                                                            return <span key={""} style={{ backgroundColor: color }}>{part.value}</span>
                                                        })}
                                                    </p>
                                                ) : (<></>)}

                                                <p>Display: {item.active ? item.deviceName : "No"}</p>
                                            </div>
                                        ),
                                        data: item
                                    }
                                ]))
                            }
                        }
                    }
                });
            })
        });
        setFileReady(1)
    }

    return (
        <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
            {fileReady === 0 ? (
                <>
                    <Label
                        className="drag-file-area flex h-30 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
                    >
                        {file ? <div className="flex flex-col items-center justify-center pb-6 pt-5">
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
                        </div> : <div className="flex flex-col items-center justify-center pb-6 pt-5">
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">Only accept .xlsx files</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Maximum size: 2.6Mb</p>
                        </div>
                        }

                        <FileInput id="dropzone-file" className="hidden" accept=".xlsx" onChange={handleFileChange} />
                    </Label>

                    <button onClick={readExcelFile} disabled={isUpdating} className="ok edit-button w-60" style={{ marginTop: "20px", width: "300px", display: "flex", alignContent: "center", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
                        Validate data
                    </button>
                </>
            ) : (
                <>
                    <p>Please review these validated items before updating</p>
                    <div className="validate-table flex flex-row">
                        <div className="validate-item-list">
                            <ul>
                                {final.map((ite) => (
                                    <li
                                        onClick={() => handleSelectedRow(ite)}
                                        className={item && ite.id === item.id ? "li-selected" : ""}
                                        key={ite.id}
                                    >
                                        <div className={ite.action === "INVALID" ? "validate-invalid" : ite.action === "EDIT" ? "validate-edit" : ite.action === "CREATE" ? "validate-create" : "validate-normal"}>
                                            <p>{ite.action}</p>
                                        </div>
                                        <div>{ite.id}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="validate-item-detail">
                            <div className="item-detail">
                                {item ? item.detail : "Please select an item to review"}
                            </div>
                            <Button className="ok edit-button" onClick={batchUpdate} disabled={isUpdating}>
                                {buttonLabel}
                            </Button>
                            <Button className="ok edit-button" onClick={() => {setFileReady(0);setButtonLabel("Accept all and Update"); setFinal([])}} disabled={isUpdating}>
                                Back
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
};

export default BatchUpdate;