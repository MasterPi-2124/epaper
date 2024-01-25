import React, { useState } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import * as XLSX from "xlsx";
import DeleteIcon from "@/assets/icons/thick/delete.svg";
import { FileInput, Label } from 'flowbite-react';
import Image from "next/image";
import { Notify } from "notiflix";
import Loading from "@/assets/imgs/loading.gif";

const BatchUpdate = () => {
    const [file, setFile] = useState(null);
    const [buttonLabel, setButtonLabel] = useState('Update Data');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const batchUpdate = async (data) => {
        setIsUpdating(true);
        setButtonLabel(`Updated 0/${data.length} data...`);

        data.map((item, index) => {
            instanceCoreApi.put(`/data/${item._id}`, item).then(res => {
                if (index + 1 === data.length) {
                    setButtonLabel(`All data updated successfully!`);
                    setIsUpdating(false);
                    Notify.success('All data updated successfully!', {
                        className: "notiflix-success"
                    });
                } else {
                    setButtonLabel(`Updated ${index + 1}/${data.length} data...`);
                }
                return res;
            }).catch(err => {
                throw err;
            })
        });
    }

    const readExcelFile = () => {
        if (!file) {
            Notify.failure('Please select a file to upload');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            batchUpdate(jsonData);
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
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
                {buttonLabel}
                {isUpdating ? <Image
                    src={Loading}
                    alt="vertical ellipsis"
                    style={{width:"50px", height: "50px", margin: "0px"}}
                /> : <></>}

            </button>
        </div>
    )
};

export default BatchUpdate;