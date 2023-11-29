import React, { useEffect, useState } from "react";
import { Table, Modal } from "@nextui-org/react";
import DeleteIcon from "@/assets/icons/thin/delete.svg";
import EditIcon from "@/assets/icons/thin/edit.svg";
import EyeIcon from "@/assets/icons/thin/eye.svg";
import Image from "next/image";
import { instanceCoreApi } from "@/services/setupAxios";
import Notify from 'notiflix/build/notiflix-notify-aio';
import DeleteModal from "../modal/delete-modal";
import EditModal from "../modal/edit-modal";
import DetailModal from "../modal/detail-modal";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [stage, setStage] = useState(0);  // 0 - Loading
  // 1 - Loaded success
  // 2 - Failed
  const [selectedUser, setSelectedUser] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);

  useEffect(() => {
    instanceCoreApi.get(`${API}/users`).then((res) => {
      setStage(1);
      setUsers(res.data.data);
    }).catch((err) => {
      Notify.Notify.failure(`Error fetching users data: ${err}`);
      setUsers([]);
      setStage(2);
    })
  }, []);

  return (
    <div className="max-w-7xl content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Users</h1>
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
          ) : users.length > 0 ? (
            <Table.Body
              items={users}
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
                      onClick={() => {
                        setDetailModal(true);
                        setSelectedUser(item._id);
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
                        setEditModal(true);
                        setSelectedUser(item._id);
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
                        setDeleteModal(true);
                        setSelectedUser(item._id);
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
                <Table.Cell className="empty">No users yet</Table.Cell>
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
            type="users"
            id={selectedUser}
            switchToEdit={() => {
              setDetailModal(false);
              setDeleteModal(true);
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
            type="users"
            id={selectedUser}
            onClose={() => {
              setDeleteModal(false);
            }}
            onConfirm={() => {
              setDeleteModal(false);
            }}
          />
        </Modal>

        <Modal
          width="600px"
          blur
          open={editModal}
          onClose={() => setEditModal(false)}
        >
          <EditModal
            type="users"
            id={selectedUser}
          />
        </Modal>
      </div>
    </div>
  );
};
