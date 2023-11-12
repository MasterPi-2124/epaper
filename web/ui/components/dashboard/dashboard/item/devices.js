import { useState } from "react";
import { useBoards } from "../../context";
import Modal from "../../modal";
import ItemDetailModal from "../../modal/item-detail";
import UserIcon from "@/assets/icons/thick/human.svg";
import SubjectIcon from "@/assets/icons/thick/subject.svg";
import DateIcon from "@/assets/icons/thick/date.svg";
import Image from "next/image";
import DeleteItemModal from "../../modal/delete-item";

const ClassItem = ({ data }) => {
    const [openItemModal, setOpenItemModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const { deleteItem } = useBoards();

    return (
        <>
            <li className="items-group select-none px-4 py-6 rounded-lg cursor-pointer"
                onClick={() => setOpenItemModal(true)}>
                <div className="item-title">
                    <p className="heading-md mb-2 group-hover:text-mainPurple">Class #{data?.codename}</p>
                </div>
                <hr />
                <div className="items-footer">
                    <div>
                        <div className="footer-item">
                            <Image alt="a subject icon" src={SubjectIcon} />
                            <p>{data?.subject}</p>
                        </div>
                        <div className="footer-item">
                            <Image alt="a subject icon" src={UserIcon} />
                            <p>{data?.quizzes.length} quizzes</p>
                        </div>
                    </div>

                    <div>
                        <div className="footer-item">
                            <p>{data?.studentCount} students</p>
                        </div>
                        <div className="footer-item">
                            <Image alt="a class icon" src={DateIcon} />
                            <p>{data?.semester}</p>
                        </div>
                    </div>
                </div>
            </li>
            <Modal show={openItemModal} onClose={() => setOpenItemModal(false)}>
                <ItemDetailModal
                    type="class"
                    data={data}
                    close={() => setOpenItemModal(false)}
                    switchToDelete={() => {
                        setOpenItemModal(false);
                        setDeleteModal(true);
                    }}
                />
            </Modal>
            <Modal show={deleteModal} onClose={() => setDeleteModal(!deleteModal)}>
                <DeleteItemModal
                    type="class"
                    data={data}
                    onClose={() => {
                        setDeleteModal(false);
                        setOpenItemModal(true);
                    }}
                    onConfirm={() => {
                        deleteItem(data._id)
                        setDeleteModal(false);
                    }} />
            </Modal>
        </>
    )
}
export default ClassItem