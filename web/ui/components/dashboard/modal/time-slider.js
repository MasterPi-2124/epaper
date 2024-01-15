import React, { useState, useRef } from "react";

function TimeSlider({ timestamps }) {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverTime, setHoverTime] = useState(null);
  const sliderRef = useRef(null);
  const beginTime = timestamps.length ? timestamps[0].split("-")[0] : -1;
  const endTime = timestamps.length ? timestamps[timestamps.length - 1].split("-")[1] : -1;
  const maxLength = endTime - beginTime;

  console.log(beginTime, endTime, maxLength);

  const convertEpoch = (epoch) => {
    return new Date(epoch).toLocaleString();
  }

  const isActive = (pos, start, end) => {
    // Implement your logic to determine if the time range is active
  };

  const handleMouseMove = (event) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width; // Position from 0 to 1
    const time = parseInt((position * maxLength + parseInt(beginTime)) * 1000);
    const mouseX = event.clientX - rect.left;
    console.log(time, position, maxLength, beginTime)
    console.log(convertEpoch(time))
    // const active = isActive(time, )
    setHoverTime({ time: convertEpoch(time), mouseX });
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  const calculatePosition = (time) => {
    return ((time - beginTime) / maxLength) * 100;
  };

  return (
    <div
      className="slider"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={sliderRef}
    >
      {timestamps.map((time, index) => {
        const [start, end] = time.split("-").map(Number);
        const positionLeft = calculatePosition(start); // Implement this function
        const positionRight = calculatePosition(end); // Implement this function
        console.log(positionLeft, positionRight);

        return (
          <div
            key={index}
            className={`range active`}
            style={{
              left: `${positionLeft + 5}%`,
              width: `${positionRight - positionLeft - 10}%`,
            }}
            onMouseEnter={() =>
              setHoverInfo({ start, end})
            }
            onMouseLeave={() => setHoverInfo(null)}
          >
            {/* Dot at the beginning */}
            <div
              className="dot"
              style={{ left: `${positionLeft}%` }}
              onMouseEnter={() =>
                setHoverInfo({ position: positionLeft, time: start, type: 'start' })
              }
              onMouseLeave={() => setHoverInfo(null)}
            />

            {/* Dot at the end */}
            <div
              className="dot"
              style={{ left: `${positionRight}%` }}
              onMouseEnter={() =>
                setHoverInfo({ position: positionRight, time: end, type: 'end' })
              }
              onMouseLeave={() => setHoverInfo(null)}
            />

            {/* Label for start time */}
            {hoverInfo && hoverInfo.type === 'start' && (
              <div
                className="label"
                style={{ left: `${hoverInfo.position}%` }}
              >
                Start: {hoverInfo.time}
              </div>
            )}

            {/* Label for end time */}
            {hoverInfo && hoverInfo.type === 'end' && (
              <div
                className="label"
                style={{ left: `${hoverInfo.position}%` }}
              >
                End: {hoverInfo.time}
              </div>
            )}
          </div>
        );
      })}

      {hoverInfo && (
        <div
          className="popup"
          style={{ left: `${calculatePosition(hoverInfo.start)}%` }}
        >
          Start: {hoverInfo.start}, End: {hoverInfo.end}, Status:{" "}
          {hoverInfo.active ? "Active" : "Inactive"}
        </div>
      )}
      {hoverTime && <div className="popup" style = {{ left: `${hoverTime.mouseX}px`, marginTop: "50px" }}>{`Time: ${hoverTime.time}`}</div>}
    </div>
  );
}

export default TimeSlider;
