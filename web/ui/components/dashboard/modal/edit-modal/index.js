import React, { useState } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import { Notify } from "notiflix";
import Data from "./data";
import Device from "./device";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const EditModal = ({ type, data }) => {
  const [port, setPort] = useState(null);
  const [itemUpdated, setItemUpdated] = useState(data);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(itemUpdated);
    await instanceCoreApi.put(`${API}/${type}/${data._id}`, itemUpdated).then(async (response) => {
      console.log(response.data);
      Notify.success(`Device info updated successfully!`);
      if (type === "devices" && port) {
        const writer = port.writable.getWriter();
        for (const [key, value] of Object.entries(itemUpdated)) {
          if (key !== "_v" && key !== "createdBy" && key !== "name" && key !== "active") {
            const keyValue = `${key}:${value}\n`;
            console.log(keyValue);
            const data = new TextEncoder().encode(keyValue);
            await writer.write(data);
          }
        }
        writer.releaseLock();
        Notify.success(`Write info to device successfully!`);
      }
    }).catch(error => {
      console.error(error);
      setSubmitted(false);
      Notify.failure(`Error updating new device info: ${error}`);
    })
  };

  const handleChange = (param, value) => {
    let userTyped = {};
    userTyped[param] = value;
    setItemUpdated(itemUpdated => ({
      ...itemUpdated,
      ...userTyped
    }))
  }

  return (
    <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8" style={{ width: "400px" }}>
      {type === "data" ? (
        <>
          <div className="modal-heading flex items-center justify-between gap-4 mb-6 flex-col">
            <h1 className="heading-lg">Edit Data Information</h1>
            <p style={{ textAlign: "center" }}>To change the data type, you have to delete and re-create new data with new data type.</p>
          </div>
          <Data
            dataUpdated={itemUpdated}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="heading-lg">{data.name}</h1>
          </div>
          <Device
            deviceUpdated={itemUpdated}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            port={port}
            setPort={setPort}
          />
        </>
      )}
    </div>
  )
}

export default EditModal;
