import { useEffect, useState } from "react"
import CreateUser from "./create-user";

const NewUser = () => {
    const handleReset = () => {
        setSubmitted(false);
    }

    return (
        <div className="content text-light-text dark:text-dark-text">
            <CreateUser
                handleReset={handleReset}
            />
        </div>
    );
};

export default NewUser;