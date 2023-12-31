import React, { useEffect, useState } from "react";
import { Table, Modal } from "@nextui-org/react";
import DeleteIcon from "@/assets/icons/thick/delete.svg";
import EditIcon from "@/assets/icons/thick/edit.svg";
import EyeIcon from "@/assets/icons/thick/eye.svg";
import DebugIcon from "@/assets/icons/thick/debug.svg";
import Image from "next/image";
import { instanceCoreApi } from "@/services/setupAxios";
import Notify from 'notiflix/build/notiflix-notify-aio';
import DeleteModal from "../modal/delete-modal";
import DebugModal from "../modal/debug-modal";
import EditModal from "../modal/edit-modal";
import DetailModal from "../modal/detail-modal";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

export const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [stage, setStage] = useState(0);  // 0 - Loading
                                          // 1 - Loaded success
                                          // 2 - Failed
  const [selectedDevice, setSelectedDevice] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [debugModal, setDebugModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);

  useEffect(() => {
    (Notify.Notify.info("Getting devices information and status ..."))
    instanceCoreApi.get(`${API}/devices`).then((res) => {
      Notify.Notify.success(`Getting devices data successfully!`);
      setStage(1);
      document.pictureInPictureElement
      setDevices(res.data.data);
    }).catch((err) => {
      Notify.Notify.failure(`Error fetching devices data: ${err}`);
      setDevices([]);
      setStage(2);
    })
  }, []);

  return (
    <div className="max-w-7xl content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
      <div className="flex justify-between items-center flex-col gap-3">
        <h1 className="text-2xl">Devices</h1>
        <p>See the list of your EPD devices and make changes.</p>
      </div>

      <div className="responses">
        <Table headerLined>
          <Table.Header>
            <Table.Column width={"auto"}>Name</Table.Column>
            <Table.Column width={"auto"}>Status</Table.Column>
            <Table.Column width={"auto"}>DataID</Table.Column>
            <Table.Column width={"auto"}></Table.Column>
          </Table.Header>
          {stage === 0 ? (
            <Table.Body>
              <Table.Row>
                <Table.Cell className="empty" col>Fetching devices data ...</Table.Cell>
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
                    {item.dataID ? item.dataID : "Not found"}
                  </Table.Cell>

                  <Table.Cell>
                  <button
                      className="small-icon"
                      onClick={() => {
                        setSelectedDevice(item);
                        setDetailModal(true);
                      }}
                    >
                      <Image
                        src={EyeIcon}
                        alt="vertical ellipsis"
                      />
                    </button>
                    <button
                      className="small-icon"
                      onClick={() => {
                        setSelectedDevice(item);
                        setEditModal(true);
                      }}
                    >
                      <Image
                        src={EditIcon}
                        alt="vertical ellipsis"
                      />
                    </button>
                    <button
                      className="small-icon"
                      onClick={() => {
                        setSelectedDevice(item);
                        setDebugModal(true);
                      }}
                    >
                      <Image
                        src={DebugIcon}
                        alt="vertical ellipsis"
                      />
                    </button>
                    <button
                      className="small-icon"
                      onClick={() => {
                        setSelectedDevice(item);
                        setDeleteModal(true);
                      }}
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

        <Modal
          blur
          open={detailModal}
          onClose={() => setDetailModal(false)}
        >
          <DetailModal
            type="devices"
            data={selectedDevice}
            switchToEdit={() => {
              setDetailModal(false);
              setEditModal(true);
            }}
            switchToDelete={() => {
              setDetailModal(false);
              setDeleteModal(true);
            }}
          />
        </Modal>

        <Modal
          width="600px"
          blur
          open={deleteModal}
          onClose={() => setDeleteModal(false)}
        >
          <DeleteModal
            type="devices"
            data={selectedDevice}
            onClose={() => {
              setDeleteModal(false);
            }}
            onConfirm={() => {
              setDeleteModal(false);
            }}
          />
        </Modal>

        <Modal
          blur
          open={debugModal}
          onClose={() => setDebugModal(false)}
        >
          <DebugModal
            data={selectedDevice}
            onClose={() => setDebugModal(false)}
          />
        </Modal>

        <Modal
          width="600px"
          blur
          open={editModal}
          onClose={() => setEditModal(false)}
        >
          <EditModal
            type="devices"
            data={selectedDevice}
          />
        </Modal>
      </div>
    </div>
  );
};
