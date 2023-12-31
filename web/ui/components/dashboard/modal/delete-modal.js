import { instanceCoreApi } from "@/services/setupAxios";
const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";
import Notify from 'notiflix/build/notiflix-notify-aio';

const DeleteModal = ({ type, data, onConfirm, onClose }) => {
    const deleteItem = () => {
        try {
            instanceCoreApi.delete(`${API}/${type}/${data._id}`);
            Notify.Notify.success("The item is deleted successfully!");
        } catch (err) {
            Notify.Notify.failure(`Error deleting item: ${err}`);
        }
    }

    if (type === "data") {
        return (
            <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
                <div className="modal-heading flex items-center justify-between gap-4 mb-6 flex-col">
                    <h1 className="text-mainRed heading-lg" style={{ fontSize: '30px' }}>Delete this data?</h1>
                </div>
                <p className="body-lg">Are you sure you want to delete this data? All displayed device will be removed after the data is deleted. <br /> THIS ACTION CAN NOT BE REVERSED.</p>
                <p>Data Name: {data.name}<br/>Data ID: {data._id}</p>
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
                <div className="modal-heading flex items-center justify-between gap-4 mb-6 flex-col">
                <h1 className="text-mainRed heading-lg">Delete this device?</h1>
                </div>
                <p className="body-lg">Are you sure you want to delete this device? This device and its data display status will be deleted. <br /> THIS ACTION CAN NOT BE REVERSED.</p>
                <p>Device Name: {data.name}<br/>Device ID: {data._id}</p>
               
                <div className="modal-footer flex gap-4">
                    <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200" onClick={() => {
                        onConfirm();
                        deleteItem();

                    }}>
                        Delete
                    </button>
                    <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    }
}
export default DeleteModal
