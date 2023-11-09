import { useEffect, useState } from "react"
import ChooseClass from "./choose-class";
import CreateQuiz from "./create-quiz";

const NewQuiz = () => {
    const [classSelected, setClassSelected] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const savedClass = JSON.parse(localStorage.getItem("classSelected"));
        if (savedClass !== null && Object.keys(savedClass).length > 0) {
            setClassSelected(savedClass);
            setSubmitted(true);
        } else {
            setSubmitted(false);
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (classSelected.className) {
            localStorage.setItem("classSelected", JSON.stringify(classSelected));
            setSubmitted(true);
        } else {
            setSubmitted(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
    }

    return (
        (!submitted) ? (
            <div className="content dark:bg-dark-background bg-light-background text-light-text dark:text-dark-text border border-solid border-light-border dark:border-dark-border">
                <ChooseClass
                    classSelected={classSelected}
                    setClassSelected={setClassSelected}
                    handleSubmit={handleSubmit}
                />
            </div>
        ) : (
            <div className="content text-light-text dark:text-dark-text">
                <CreateQuiz
                    classSelected={classSelected}
                    setClassSelected={setClassSelected}
                    handleReset={handleReset}
                />
            </div>
        )
    );
};

export default NewQuiz;