import { instanceCoreApi } from "@/services/setupAxios";
const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";
import {Notify} from "notiflix";
const DeleteModal = ({ type, data, onConfirm, onClose }) => {
    const deleteItem = async () => {
        Notify.info("Deleting item", {
            className: "notiflix-info"
        });

        await instanceCoreApi.delete(`${API}/${type}/${data._id}`).then(response => {
            Notify.success("The item is deleted successfully!", {
                className: "notiflix-success"
            });
        }).catch(error => {
            Notify.failure(`Error deleting item: ${error}`, {
                className: "notiflix-failure"
            });
        });
    }

    if (type === "data") {
        return (
            <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
                <div className="modal-heading flex items-center justify-between mb-6 flex-col">
                    <h1 className="text-mainRed heading-lg" style={{ fontSize: '30px' }}>Delete this data?</h1>
                    <p>{data.type}: {data.name}</p>
                </div>
                <p style={{fontWeight:"200", marginBottom: "10px", marginTop: "20px"}}>Are you sure you want to delete this data? All displayed devices will be removed after the data is deleted.</p>
                <p style={{fontSize: "20px", marginBottom: "30px"}}>THIS ACTION CAN NOT BE REVERSED.</p>
                <div className="modal-footer flex gap-4">
                    <button className="ok delete-button flex-1 text-white text-base rounded-full p-2 transition duration-200" onClick={() => {
                        onConfirm();
                        deleteItem();
                    }}>
                        Delete
                    </button>
                    <button className="ok flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
                <div className="modal-heading flex items-center justify-between mb-6 flex-col">
                    <h1 className="text-mainRed heading-lg" style={{ fontSize: '30px' }}>Delete this device?</h1>
                    <p>{data.name}: {data._id}</p>
                </div>
                <p style={{fontWeight:"200", marginBottom: "10px", marginTop: "20px"}}>Are you sure you want to delete this device? This device and its data display status will be deleted.</p>
                <p style={{fontSize: "20px", marginBottom: "30px"}}>THIS ACTION CAN NOT BE REVERSED.</p>

                <div className="modal-footer flex gap-4">
                    <button className="ok delete-button flex-1 text-white text-base rounded-full p-2 transition duration-200" onClick={() => {
                        onConfirm();
                        deleteItem();
                    }}>
                        Delete
                    </button>
                    <button className="ok flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    }
}
export default DeleteModal
