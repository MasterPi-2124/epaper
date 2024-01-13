import { Notify } from "notiflix";
import { useState, useRef } from 'react';

export const useSerialPort = () => {
    const [serialData, setSerialData] = useState('');
    const reader = useRef(null);

    const readData = async () => {
        if (!reader.current) {
            console.error('Reader is not initialized');
            return;
        }

        try {
            while (reader.current) {
                const { value, done } = await reader.current.read();
                if (done) {
                    break;
                }
                setSerialData(prevData => prevData + value);
            }
        } catch (err) {
            Notify.warning('Error reading from serial port. Please refreshing the page.');
        } finally {
            if (reader.current) {
                reader.current.releaseLock();
                reader.current = null;
            }
        }
    };

    const onConnectSerial = async () => {
        if ('serial' in navigator) {
            try {
                const port = await navigator.serial.requestPort();
                await port.open({ baudRate: 115200 }); // Set the baud rate

                const textDecoder = new TextDecoderStream();
                port.readable.pipeTo(textDecoder.writable);
                reader.current = textDecoder.readable.getReader();
                console.log('Reader set:', reader.current);
                readData();
            } catch (err) {
                Notify.warning('There was an error opening the serial port. Please refreshing the page.');
            }
        } else {
            Notify.failure('Web Serial API not supported in this browser.');
        }
    };

    const onDisconnectSerial = () => {
        setSerialData('');
        if (reader.current) {
            reader.current.releaseLock();
            reader.current = null;
        }
    }

    return { serialData, onConnectSerial, onDisconnectSerial };
}