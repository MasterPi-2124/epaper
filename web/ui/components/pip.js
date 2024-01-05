// components/PiPComponent.js
import { Textarea } from '@nextui-org/react';
import { usePiP } from '../services/pip';
import Draggable from "react-draggable";

const PiPComponent = () => {
    const { isPiPVisible, serialData, stopPiP } = usePiP();

    if (!isPiPVisible) return null;

    return (
        <Draggable>
            <div className='pip'>
                <div className='pip-head'>
                    <label>Serial Output of</label>
                    <button onClick={stopPiP}>x</button>
                </div>
                <Textarea
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    value={serialData}
                    readOnly
                    fullWidth
                    maxRows={10}
                />
            </div>
        </Draggable>
    );
};

export default PiPComponent;
