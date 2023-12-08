import { instanceCoreApi } from "@/services/setupAxios";
const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";
import Notify from 'notiflix/build/notiflix-notify-aio';
import { useEffect, useState } from "react";

const DeleteModal = ({ type, id, onConfirm, onClose }) => {
    const [item, setItem] = useState({});
    useEffect(() => {
        instanceCoreApi.get(`${API}/${type}/${id}`).then((res) => {
            setItem(res.data.data);
        })
    }, []);
    
    const deleteItem = () => {
        try {
            instanceCoreApi.delete(`${API}/${type}/${id}`);
            Notify.Notify.success("The item is deleted successfully!");
        } catch (err) {
            Notify.Notify.failure(`Error deleting item: ${err}`);
        }
    }

    if (type === "users") {
        return (
            <div className="modal space-y-6 w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
                <h1 className="text-mainRed heading-lg">Delete this user?</h1>
                <p className="body-lg">Are you sure you want to delete this user? All displayed device will be removed after the user is deleted. <br /> THIS ACTION CAN NOT BE REVERSED.</p>
                <p>User Name: {item.name}</p>
                <p>User ID: {item._id}</p>
                <div className="flex gap-4">

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
    } else {
        return (
            <div className="modal space-y-6 w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
                <h1 className="text-mainRed heading-lg">Delete this device?</h1>
                <p className="body-lg">Are you sure you want to delete this device? This device and it&apos;s user display status will be deleted. <br /> THIS ACTION CAN NOT BE REVERSED.</p>
                <p>Device ID: {item._id}</p>
                <div className="flex gap-4">

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
