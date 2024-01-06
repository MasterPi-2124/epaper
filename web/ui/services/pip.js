import { createContext, useContext, useState } from 'react';
import { useSerialPort } from './serialPort';

const PiPContext = createContext();

export const usePiP = () => useContext(PiPContext);

export const PiPProvider = ({ children }) => {
    const { serialData, onConnectSerial, onDisconnectSerial } = useSerialPort();
    const [isPiPVisible, setIsPiPVisible] = useState(false);

    const showPiP = () => {
        setIsPiPVisible(true);
    };

    const hidePiP = () => {
        setIsPiPVisible(false);
    };

    const stopPiP = () => {
        console.log("diables")
        setIsPiPVisible(false);
        onDisconnectSerial();
        console.log("diablesdfgdfgdf")

    }

    return (
        <PiPContext.Provider value={{ isPiPVisible, showPiP, hidePiP, stopPiP, serialData, onConnectSerial }}>
            {children}
        </PiPContext.Provider>
    );
};
