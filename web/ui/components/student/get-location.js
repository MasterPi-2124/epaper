import { useState } from "react";
import { instanceCoreApi } from "@/services/setupAxios";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";
const GetLocation = ({ IP, quizDetail, classDetail, location, checkLat, checkLon, setLocation, handleSubmit }) => {
    const [distance, setDistance] = useState(999999);
    const getLocation = () => {
        checkIP();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    const getDistance = calculateDistance(latitude, longitude, checkLat, checkLon);
                    setDistance(getDistance);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    const checkIP = async () => {
        try {
            await instanceCoreApi.get(`${API}/quizRecords/${quizDetail._id}`).then((res) => {
                const responses = res.data.data.studentList;
                console.log(responses)
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance * 1000;
    };

    const toRadians = (angle) => {
        return (angle * Math.PI) / 180;
    };

    const reportFail = () => {
        console.log("reported to server")
    }

    return (
        <>
            <h1>Welcome to Class {classDetail.codename}!</h1>
            <p>{classDetail.subject} - {classDetail.semester}</p>
            <br />
            {location ? (
                distance <= 10000 ? (
                    <>
                        <p>Thank you. Press &quot;Start&quot; button below to continue</p>
                        <button className="ok" style={{ marginTop: "20px", padding: "10px 50px", transitionDuration: "200ms" }} onClick={handleSubmit}>
                            Start
                        </button>
                    </>
                ) : (
                    <>
                        <p>This seems like you are not at the class right now. You must be in the class to access to the quiz.</p>
                        <p>Your current location: ({location.latitude}, {location.longitude})</p>
                        <p>Your distance to the class: {distance} meters</p>
                        <button className="ok" style={{ marginTop: "20px", padding: "10px 30px", transitionDuration: "200ms" }} onClick={reportFail}>
                            Bye!
                        </button>
                    </>
                )
            ) : (
                <>
                    <p>Before continuing, please grant access to your Location</p>
                    <button className="ok" style={{ marginTop: "20px", padding: "10px 50px", transitionDuration: "200ms" }} onClick={getLocation}>
                        Get Location
                    </button>
                </>
            )}
        </>
    );
};

export default GetLocation;