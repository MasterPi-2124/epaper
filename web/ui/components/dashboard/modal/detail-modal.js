import React, { useEffect, useState } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import Link from "next/link";
import { Notify } from "notiflix";
import TimeSlider from "./time-slider";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const DetailModal = ({ type, data, switchToEdit, switchToDelete }) => {
  const [data1, setData1] = useState();

  useEffect(() => {
    console.log(type, data)
    if (type === "devices" && data.dataID) {
      instanceCoreApi.get(`${API}/data/${data.dataID}`).then((res) => {
        setData1(res.data.data);
      }).catch((error) => {
        Notify.failure(`Error fetching data: ${error}`);
        console.log(error)
        setData1();
      })
    } else if (type === "data" && data.deviceID) {
      console.log("asdasd")
      instanceCoreApi.get(`${API}/devices/${data.deviceID}`).then((res) => {
        console.log(res.data.data)
        setData1(res.data.data);
      }).catch((error) => {
        Notify.failure(`Error fetching device data: ${error}`);
        console.log(error)
        setData1();
      })
    }
  }, []);

  if (type === "devices") {
    return (
      <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8" style={{ width: "700px" }}>
        {console.log(data, data1)}
        <div className="modal-heading flex items-left justify-between mb-6 flex-row" >
          <div>
            <h1 className="heading-lg">{data.name}</h1>
            <p className="heading-lg">{data._id}</p>
          </div>
          <div>
            <h1
              className="heading-lg"
              style={{
                textAlign: "right"
              }}
            >
              {data.active ? "Active" : "Inactive"}
            </h1>
            <p style={{
              textAlign: "right"
            }}
            >
              {data.active ? data.ssid : "Not connected to a network"}
            </p>
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
              <p style={{textAlign: "center"}}>The device currently has no data to display. Go to <Link href="/dashboard/data"><em className="hover:font-medium hover:underline"> Data Dashboard</em></Link> to select data to display, or create a new data <Link href="/new-data"><em className="hover:font-medium hover:underline">here</em></Link>.</p>
            </>
          )}
        </div>

        <div className="flex gap-4 modal-footer">
          <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200 edit-button ok" onClick={() => switchToEdit()}>
            Edit
          </button>
          <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200 delete-button ok" onClick={() => switchToDelete()}>
            Delete
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8" style={{ width: "700px" }}>
        <div className="modal-heading flex items-left justify-between mb-6 flex-row">
          <div>
            <h1 className="heading-lg">{data.name}</h1>
            <p className="heading-lg">{data._id}</p>
          </div>
          <div>
            <h1
              className="heading-lg"
              style={{
                textAlign: "right"
              }}
            >
              {data.active ? "Displaying" : "Not currently displayed"}
            </h1>
            <p style={{
              textAlign: "right"
            }}
            >
              {data.active && data.deviceName}
            </p>
          </div>
        </div>

        <div className="stats">
          <>
            <p style={{ marginBottom: "10px" }}>Here is the data information:</p>
            <p className="body-lg text-mediumGrey">
              - Name: <strong>{data.name}</strong>
            </p>
            <p className="body-lg">
              - Type: <strong>{data.type}</strong>
            </p>
            {data.type === "Client" ? (
              <>
                <p>
                  - Email: <strong>{data.email}</strong>
                </p>
                <p>
                  - Address: <strong>{data.input2}</strong>
                </p>
              </>
            ) : data.type === "Student" ? (
              <>
                <p>
                  - Email: <strong>{data.email}</strong>
                </p>
                <p>
                  - Student ID: <strong>{data.input2}</strong>
                </p>
                <p>
                  - Class: <strong>{data.input3}</strong>
                </p>
              </>
            ) : data.type === "Product" ? (
              <>
                <p>
                  - Category: <strong>{data.input2}</strong>
                </p>
                <p>
                  - Price: <strong>{data.input3}</strong>
                </p>
              </>
            ) : data.type === "Employee" ? (
              <>
                <p>
                  - Email: <strong></strong>{data.email}
                </p>
                <p>
                  - Employee ID: <strong>{data.input2}</strong>
                </p>
                <p>
                  - Department: <strong>{data.input3}</strong>
                </p>
              </>
            ) : (
              <>
                <p>
                  - Purpose: <strong>{data.input2}</strong>
                </p>
                <p>
                  - Manager: <strong>{data.input3}</strong>
                </p>
                <p>
                  - Status: <strong>{data.input4}</strong>
                </p>
              </>
            )}
            <div className="separator" />
            <h1>Display Status</h1>
            {data1 ? (
              <>
                <p>Device: {data1.name}</p>
                <p>Device ID: {data1._id}</p>
                <p>Device Status: {data1.active ? "connected" : "disconnected"}</p>
              </>
            ) : (
              <></>
            )}
            <p>
              Start Time: {new Date(data.activeStartTime * 1000).toLocaleString()}
            </p>
            <p>
              Timestamp:
            </p>
            <TimeSlider timestamps={data.activeTimestamp} />

          </>
        </div>
        <div className="flex gap-4 modal-footer">
          <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200 edit-button ok" onClick={() => switchToEdit()}>
            Edit
          </button>
          <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200 delete-button ok" onClick={() => switchToDelete()}>
            Delete
          </button>
        </div>
      </div>
    )
  }
}

export default DetailModal
