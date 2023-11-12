import QuizItem from "./users";
import ClassItem from "./devices";

const Item = ({ type, data, index }) => {

    if (type == "Quizzes") {
        return <QuizItem data={data} />;
    } else if (type == "Classes") {
        return <ClassItem data={data} />;
    }
}
export default Item