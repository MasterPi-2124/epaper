import React, { useEffect, useState } from "react";
import Modal from "../modal";
import { Table } from "@nextui-org/react";
import DeleteIcon from "@/assets/icons/thin/delete.svg";
import EditIcon from "@/assets/icons/thin/edit.svg";
import EyeIcon from "@/assets/icons/thin/eye.svg";
import Image from "next/image";
import { instanceCoreApi } from "@/services/setupAxios";
import Notify from 'notiflix/build/notiflix-notify-aio';

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

export const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [stage, setStage] = useState(0);  // 0 - Loading
  // 1 - Loaded success
  // 2 - Failed
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  useEffect(() => {
    instanceCoreApi.get(`${API}/devices`).then((res) => {
      setStage(1);
      setDevices(res.data.data);
    }).catch((err) => {
      Notify.Notify.failure(`Error fetching devices data: ${err}`);
      setDevices([]);
      setStage(2);
    })
  }, []);

  return (
    <div className="max-w-7xl content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Devices</h1>
      </div>

      <div className="responses">
        <Table headerLined>
          <Table.Header>
            <Table.Column width={"auto"}>Name</Table.Column>
            <Table.Column width={"auto"}>Status</Table.Column>
            <Table.Column width={"auto"}>UserID</Table.Column>
            <Table.Column width={"auto"}></Table.Column>
          </Table.Header>
          {stage === 0 ? (
            <Table.Body>
              <Table.Row>
                <Table.Cell className="empty" col>Fetching data ...</Table.Cell>
                <Table.Cell className="empty" />
                <Table.Cell className="empty" />
                <Table.Cell className="empty" />
              </Table.Row>
            </Table.Body>
          ) : stage === 2 ? (
            <Table.Body>
              <Table.Row>
                <Table.Cell className="empty">Fetching failed with errors!</Table.Cell>
                <Table.Cell className="empty" />
                <Table.Cell className="empty" />
                <Table.Cell className="empty" />
              </Table.Row>
            </Table.Body>
          ) : devices.length > 0 ? (
            <Table.Body
              items={devices}
            >
              {(item) => (
                <Table.Row key={item._id}>
                  <Table.Cell>
                      <p className="name">
                        {item.name}
                      </p>
                    <p className="id">
                      {item._id}
                    </p>
                  </Table.Cell>

                  <Table.Cell>
                    {item.active ? (
                      <span style={{
                        padding: "2px 14px",
                        borderRadius: "15px",
                        fontWeight: "600",
                        backgroundColor: "green"
                      }}>
                        ACTIVE
                      </span>
                    ) : (
                      <span style={{
                        padding: "2px 14px",
                        borderRadius: "15px",
                        fontWeight: "600",
                        backgroundColor: "grey"
                      }}>
                        INACTIVE
                      </span>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    {item.userID ? item.userID : "Not found"}
                  </Table.Cell>

                  <Table.Cell>
                  <button
                      className="small-icon"
                      onClick={() => setOpenEditModal(true)}
                    >
                      <Image
                        src={EyeIcon}
                        alt="vertical ellipsis"
                      />
                    </button>
                    <button
                      className="small-icon"
                      onClick={() => setOpenEditModal(true)}
                    >
                      <Image
                        src={EditIcon}
                        alt="vertical ellipsis"
                      />
                    </button>
                    <button
                      className="small-icon"
                      onClick={() => setOpenDeleteModal(true)}
                    >
                      <Image
                        src={DeleteIcon}
                        alt="vertical ellipsis"
                      />
                    </button>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          ) : (
            <Table.Body>
              <Table.Row>
                <Table.Cell className="empty">No devices yet</Table.Cell>
                <Table.Cell className="empty" />
                <Table.Cell className="empty" />
                <Table.Cell className="empty" />
              </Table.Row>
            </Table.Body>
          )}
          <Table.Pagination
            noMargin
            align="center"
            rowsPerPage={7}
          />
        </Table>

        <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
          Hello
        </Modal>

        <Modal show={openDetailModal} onClose={() => setOpenDetailModal(false)}>
          Hello
        </Modal>

        <Modal show={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          Delete here
        </Modal>
      </div>
    </div>
  );
};
