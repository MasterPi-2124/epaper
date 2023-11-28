import React, { useEffect, useState } from "react";
import { instanceCoreApi } from "../../services/setupAxios";
// import Modal from "../dashboard/modal";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

export const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    instanceCoreApi
      .get(`${API}/devices`)
      .then((res) => {
        setDevices(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="max-w-7xl content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Devices</h1>
        </div>
        <div className="mt-7">
          <table className="table-fixed w-full">
            <thead>
              <tr>
                <th className="w-1/12">Name</th>
                <th className="w-2/12">SSID</th>
                <th className="w-2/12">Password</th>
                <th className="w-2/12">Active</th>
                <th className="w-2/12">User ID</th>
                <th className="w-2/12">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Error: {error}
                  </td>
                </tr>
              ) : (
                devices.map((device, index) => (
                  <tr key={index}>
                    <td>{device.name}</td>
                    <td>{device.ssid}</td>
                    <td>{device.pass}</td>
                    <td>{device.active ? "True" : "False"}</td>
                    <td>{device.userID}</td>
                    <td>
                      <button
                        className="edit pr-2"
                        onClick={() => setOpenEditModal(true)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete"
                        onClick={() => setOpenDeleteModal(true)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
            Hello
          </Modal>

          <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
            Delete here
          </Modal>
        </div>
      </div>
    </div>
  );
};
