import React, { useEffect, useState } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import Link from "next/link";
import Notify from 'notiflix/build/notiflix-notify-aio';

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const DetailModal = ({ type, id, switchToEdit, switchToDelete }) => {
  const [device, setDevice] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    if (type === "devices") {
      instanceCoreApi.get(`${API}/devices/${id}`).then((res) => {
        setDevice(res.data.data);
        if (res.data.data.userID) {
          instanceCoreApi.get(`${API}/users/${res.data.data.userID}`).then((res) => {
            setUser(res.data.data);
          }).catch((error) => {
            Notify.Notify.failure(`Error fetching data data: ${error}`);
            console.log(error)
            setUser();
          })
        }
      }).catch((error) => {
        Notify.Notify.failure(`Error fetching data data: ${error}`);
        console.log(error)
        setDevice();
      })
    } else {
      instanceCoreApi.get(`${API}/users/${id}`).then((res) => {
        setUser(res.data.data);
        if (res.data.data.deviceID) {
          instanceCoreApi.get(`${API}/devices/${res.data.data.deviceID}`).then((res) => {
            setDevice(res.data.data);
          }).catch((error) => {
            Notify.Notify.failure(`Error fetching data data: ${error}`);
            console.log(error)
            setDevice();
          })
        }
      }).catch((error) => {
        Notify.Notify.failure(`Error fetching data data: ${error}`);
        console.log(error)
        setUser();
      })
    }
  }, []);

  if (type === "devices") {
    return (
      (device) ? (
        <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
          <div className="modal-heading flex items-left justify-between mb-6 flex-row">
            <div>
              <h1 className="heading-lg">{device.name}</h1>
              <p className="heading-lg">{device._id}</p>
            </div>
            <div>
              <h1 className="heading-lg">{device.active ? "Active" : "Inactive"}</h1>
              <p>{device.active ? device.ssid : "Not connected to a network"}</p>
            </div>
          </div>

          <div className="stats">
            <h1>User</h1>
            {device.userID ? (
              <>
                <p className="body-lg text-mediumGrey">
                  Name: {user.name}
                </p>
                <p className="body-lg">
                  Email: {user.email}
                </p>

                <p className="body-lg text-mediumGrey">
                  Address: {user.address}
                </p>
              </>
            ) : (
              <>
                The device currently has no data to display. Go to <Link href="/dashboard/users"> user dashboard</Link> to select user to display, or create a new user <Link href="/new-user">here</Link>.
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200" onClick={() => switchToEdit()}>
              Edit
            </button>
            <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200" onClick={() => switchToDelete()}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>Failed to get data!</>
      )
    )
  } else {
    return (
      (user) ? (
        <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
          <div className="modal-heading flex items-center justify-between gap-4 mb-6">
            <h1 className="heading-lg">User Information</h1>

          </div>
          <div className="stats">
            <p className="body-lg text-mediumGrey">
              {/* Type: {user.type} */}
            </p>
            <p className="body-lg text-mediumGrey">
              Name: {user.name}
            </p>
            <p className="body-lg text-mediumGrey">
              Email: {user.email}
            </p>
            <p className="body-lg text-mediumGrey">
              Address: {user.address}
            </p>
            <p className="body-lg text-mediumGrey">
              {/* Displayed Device: {device.name} */}
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200" onClick={() => switchToDelete()}>
              Delete
            </button>
            <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200" onClick={() => switchToEdit()}>
              Edit
            </button>
          </div>
        </div>
      ) : (
        <></>
      )
    )
  }
}

export default DetailModal
