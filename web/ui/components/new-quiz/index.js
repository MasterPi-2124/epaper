import { useEffect, useState } from "react"
import CreateQuiz from "./create-quiz";

const NewQuiz = () => {

    const handleReset = () => {
        setSubmitted(false);
    }

    return (
        <div className="content text-light-text dark:text-dark-text">
            <CreateQuiz
                handleReset={handleReset}
            />
        </div>
    );
};

export default NewQuiz;