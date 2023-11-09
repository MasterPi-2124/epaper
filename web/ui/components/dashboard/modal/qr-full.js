import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { encodePath } from "@/services/securePath";

const QRModal = ({ startTime, endTime, quizID, url }) => {
    const [location, setLocation] = useState({});
    const [time, setTime] = useState(new Date().getTime());
    const end = new Date(endTime).getTime();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({
                        "lat": latitude,
                        "lon": longitude
                    })
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prevTime => prevTime + 1000);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (time >= end) {
            alert('Timer ended');
        }
    }, [time, end]);

    const timeRemaining = Math.max(0, end - time);
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60));

    return (
        <div className="modal space-y-6 w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
            {console.log("---------", location, Object.keys(location).length)}
            {time < end && Object.keys(location).length > 0 ? (
                <div className="qr-wrapper">
                    {/* {`${url}/${encodePath(`${quizID}/${location.lat}/${location.lon}`)}`} */}
                    <QRCodeSVG value={`${url}/${encodePath(`${quizID}/${location.lat}/${location.lon}`)}`} />
                </div>
            ) : (
            <></>
            )}
            <p className="time-left">{`${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`}</p>
        </div>
    )
}
export default QRModal;
