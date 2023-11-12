import { useBoards } from '../context';
import Column from './column';
import Item from './item';

const Dashboard = () => {
    const { currentBoard } = useBoards();
    console.log(currentBoard);

    return (
        <main className='dashboard overflow-y-hidden flex'>
            {
                currentBoard?.columns?.map((column, i) => (
                    <Column data={column} key={i}>
                        {
                            column?.items.map((itemId, j) => {
                                const item = currentBoard.items?.filter(item => item?._id === itemId)[0];
                                return <Item type={currentBoard?.name} data={item} key={j} />
                            })
                        }
                    </Column>
                ))
            }
        </main>
    )
}
export default Dashboard