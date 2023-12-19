import React, { useState, useRef } from "react";

function TimeSlider({ timestamps }) {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverTime, setHoverTime] = useState(null);
  const sliderRef = useRef(null);

  const handleMouseMove = (event) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width; // Position from 0 to 1
    const time = 0 + position * (10 - 0);
    setHoverTime(time.toFixed(2)); // Adjust precision as needed
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  const isActive = (start, end) => {
    // Implement your logic to determine if the time range is active
  };
  const calculatePosition = (time, max) => {
    return (time / max) * 100;
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
        const positionLeft = calculatePosition(start, 10); // Implement this function
        const positionRight = calculatePosition(end, 10); // Implement this function

        return (
          <div
            key={index}
            className={`range active`}
            style={{
              left: `${positionLeft}%`,
              width: `${((positionRight - positionLeft) * 600) / 100}px`,
            }}
            onMouseEnter={() =>
              setHoverInfo({ start, end, active: isActive(start, end) })
            }
            onMouseLeave={() => setHoverInfo(null)}
          />
        );
      })}

      {hoverInfo && (
        <div
          className="popup"
          style={{ left: `${calculatePosition(hoverInfo.start, 10)}%` }}
        >
          Start: {hoverInfo.start}, End: {hoverInfo.end}, Status:{" "}
          {hoverInfo.active ? "Active" : "Inactive"}
        </div>
      )}
      {hoverTime && <div className="popup">{`Time: ${hoverTime}`}</div>}
    </div>
  );
}

export default TimeSlider;
