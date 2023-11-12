import { useState, useEffect } from "react";
import Modal from "../../modal";
import ItemDetailModal from "../../modal/item-detail";
import DeleteItemModal from "../../modal/delete-item";
import QRModal from "../../modal/qr-full";
import { useBoards } from "../../context";
import SubjectIcon from "@/assets/icons/thick/subject.svg";
import TimeIcon from "@/assets/icons/thick/time.svg";
import DateIcon from "@/assets/icons/thick/date.svg";
import HumanIcon from "@/assets/icons/thick/human.svg";
import Image from "next/image";
import { instanceCoreApi } from "@/services/setupAxios";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";
const HOST = process.env.NEXT_PUBLIC_BASE_URL;

const QuizItem = ({ data }) => {
    const [openItemModal, setOpenItemModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [qrModal, setQRModal] = useState(false);
    const { deleteItem } = useBoards();
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        try {
            instanceCoreApi.get(`${API}/quizRecords/${data._id}`).then(res => {
                console.log("ahihi", res.data)
                setResponses(res.data.data.studentList);
            })

        } catch (err) {
            console.error(err);
        }
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    return (
        <>
            <li
                className="items-group select-none px-4 py-6 rounded-lg cursor-pointer"
                onClick={() => setOpenItemModal(true)}
            >
                <div className="item-title">
                    <p className="heading-md mb-2">Quiz #{data._id.substring(0, 8)}</p>
                    {data.status === "In Progress" ? (
                        <button className="get-qr" onClick={() => {
                            setOpenItemModal(false);
                            setQRModal(true);
                        }}>
                            Get QR
                        </button>
                    ) : (
                        <></>
                    )}

                </div>
                <hr />
                <div className="items-footer">
                    <div>
                        <div className="footer-item">
                            <Image alt="a class icon" src={SubjectIcon} />
                            <p>{data._class.subject}</p>
                        </div>
                        <div className="footer-item">
                            <Image alt="a time icon" src={TimeIcon} />
                            <p>{(new Date(data.endTime) - new Date(data.startTime)) / (1000 * 60)} mins</p>
                        </div>
                    </div>
                    <div>

                        <div className="footer-item">
                            <Image alt="a date icon" src={DateIcon} />
                            <p>{new Date(data.startTime).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                        </div>
                        <div className="footer-item">
                            <Image alt="a human icon" src={HumanIcon} />
                            <p>{responses.length}/{data._class.studentCount}</p>
                        </div>
                    </div>
                </div>
            </li>
            <Modal show={openItemModal} onClose={() => setOpenItemModal(false)}>
                <ItemDetailModal
                    type="quiz"
                    data={data}
                    responses={responses}
                    close={() => setOpenItemModal(false)}
                    switchToDelete={() => {
                        setOpenItemModal(false);
                        setDeleteModal(true);
                    }}
                />
            </Modal>
            <Modal show={deleteModal} onClose={() => setDeleteModal(!deleteModal)}>
                <DeleteItemModal
                    type="quiz"
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
            <Modal show={qrModal} onClose={() => setQRModal(!qrModal)}>
                <QRModal
                    startTime={data.startTime}
                    endTime={data.endTime}
                    quizID={data._id}
                    url={`${HOST}/quiz`}
                />
            </Modal>
        </>
    )



}
export default QuizItem