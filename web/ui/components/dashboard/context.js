import { createContext, useContext, useState, useEffect } from "react";
import { instanceCoreApi } from "@/services/setupAxios";

const API = process.env.NEXT_PUBLIC_API;
const BoardContext = createContext();

function BoardProvider({ data, type, children }) {
    const [boards, setBoards] = useState();
    const [currentBoard, setCurrentBoard] = useState();

    useEffect(() => {
        setBoards(data?.boards);
        setCurrentBoard(type === "quizzes" ? data?.boards?.quizzes : data?.boards?.classes);
        console.log({ boards })
    }, [data])

    console.log("ahihi", currentBoard, boards)

    const deleteItem = (itemId) => {
        if (type === "quizzes") {
            try {
                instanceCoreApi.delete(`${API}/quizzes/${itemId}`).then(() => {
                    const item = currentBoard.items.find((item) => item._id === itemId);
                    const column = currentBoard?.columns?.find((column) => column.name === item.status);
                    console.log(currentBoard);
                    const newCurrentBoards = currentBoard;

                    newCurrentBoards.items = currentBoard?.items?.filter(
                        (item) => item._id !== itemId
                    )
                    column.items = column?.items?.filter((id) => id !== itemId);

                    setBoards(prevBoards => ({ ...prevBoards, ...boards }));
                    setCurrentBoard(prevCurrent => ({ ...prevCurrent, ...newCurrentBoards }));
                    console.log(currentBoard);
                });

            } catch (err) {
                console.error(err);
            }

        } else if (type === "classes") {
            try {
                instanceCoreApi.delete(`${API}/classes/${itemId}`).then(() => {
                    const item = currentBoard.items.find((item) => item._id === itemId);
                    const column = currentBoard?.columns?.find((column) => column.name === item.semester);
                    console.log(currentBoard);
                    const newCurrentBoards = currentBoard;

                    newCurrentBoards.items = currentBoard?.items?.filter(
                        (item) => item._id !== itemId
                    )
                    column.items = column?.items?.filter((id) => id !== itemId);

                    if (column.items.length === 0) {
                        newCurrentBoards.columns = currentBoard?.columns?.filter(
                            (col) => col.name !== column.name
                        )
                    }

                    setBoards(prevBoards => ({ ...prevBoards, ...boards }));
                    setCurrentBoard(prevCurrent => ({ ...prevCurrent, ...newCurrentBoards }));
                    console.log(currentBoard);
                });

            } catch (err) {
                console.error(err);
            }
        }

    };

    const value = {
        boards,
        currentBoard,
        deleteItem,
    };

    return (
        <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
    );
}

const useBoards = () => {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error("useBoards must be used within a BoardProvider");
    }
    return context;
};

export { BoardProvider, useBoards };
