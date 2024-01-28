import React, { useState, useEffect } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import * as XLSX from "xlsx";
import { Notify } from "notiflix";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const Export = () => {
    const handleExport = (event) => {
        event.preventDefault();
        Notify.info(`Fetching data and device`, {
            className: "notiflix-info"
        });

        instanceCoreApi.get(`${API}/data`).then(res => {
            const data = res.data.data;
            const fieldsToRemove = new Set(["__v", "deviceName", "activeStartTime", "activeTimestamp", "createdBy"]);
            const newData = data.map(obj => {
                const filteredObj = {};
                Object.keys(obj).forEach(key => {
                    if (!fieldsToRemove.has(key)) {
                    filteredObj[key] = obj[key];
                    }
                });
                return filteredObj;
            });

            instanceCoreApi.get(`${API}/devices`).then(res => {
                const devices = res.data.data;
                Notify.success(`Fetching data and device`, {
                    className: "notiflix-success"
                });
                const time = Date.now();
                console.log(newData, devices)
                const datasheet = XLSX.utils.json_to_sheet(newData);
                const devicesheet = XLSX.utils.json_to_sheet(devices);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, datasheet, 'Data');
                XLSX.utils.book_append_sheet(workbook, devicesheet, 'Devices');
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const data1 = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
                const downloadUrl = URL.createObjectURL(data1);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${time}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch(err => {
                Notify.failure(`Error fetching devices!\n${err}`, {
                    className: "notiflix-failure",
                });
                return;
            })
        }).catch(err => {
            Notify.failure(`Error fetching data!\n${err}`, {
                className: "notiflix-failure",
            });
            return;
        })
    }

    return (
        <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
            <form className="form" onSubmit={handleExport}>
                <label>This will take all data and device status at the time of export and write it to Excel file.</label>
                <button className="dark:bg-dark-background" type="submit">Export</button>
            </form>
        </div>
    )
};

export default Export;