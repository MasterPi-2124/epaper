import React, { useEffect, useState, useRef } from "react";

function TimeSlider({ timestamps }) {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverTime, setHoverTime] = useState(null);
  const sliderRef = useRef(null);
  const [ratios, setRatios] = useState([]);
  const [pos, setPos] = useState([]);
  const [timestamp, setTimestamp] = useState([]);

  const calculateRatios = (timeRanges) => {
    const parsedRanges = timeRanges.map(range => range.split('-').map(Number));
    const durations = parsedRanges.map(range => range[1] - range[0]);
    setTimestamp(parsedRanges);

    const intervals = [];
    for (let i = 1; i < parsedRanges.length; i++) {
      const gap = parsedRanges[i][0] - parsedRanges[i - 1][1];
      intervals.push(gap);
    }

    const combinedRatios = [];
    for (let i = 0; i < durations.length; i++) {
      combinedRatios.push(parseInt(Math.pow(durations[i], 0.2)));
      if (intervals[i] !== undefined) {
        combinedRatios.push(parseInt(Math.pow(intervals[i], 0.2) * 0.3));
      }
    }

    const total = combinedRatios.reduce((sum, ratio) => sum + ratio, 0);
    const normalizedRatios = combinedRatios.map(ratio => (ratio / total) * 100);
    setRatios(normalizedRatios);

    const leftPositions = normalizedRatios.reduce((acc, current, index) => {
      if (index === 0) {
        acc.push(0); // The first segment always starts at 0%
      } else {
        // Add the current segment's left position, which is the sum of all previous segments
        acc.push(acc[index - 1] + normalizedRatios[index - 1]);
        if (index === normalizedRatios.length - 1) {
          acc.push(100); // The last segment always starts at 100%
        }
      }
      return acc;
    }, []);
    setPos(leftPositions);
  }

  useEffect(() => {
    calculateRatios(timestamps);
  }, [timestamps])

  const convertEpoch = (epoch) => {
    console.log("time", epoch)
    return new Date(epoch).toLocaleString();
  }

  const isActive = (pos, start, end) => {
    // Implement your logic to determine if the time range is active
  };

  const handleMouseMove = (event) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const position = ((event.clientX - rect.left) / rect.width * 100 - 5) / 0.9; // Position percentage from 0 to 100
    const mouseX = event.clientX - rect.left;
    pos.map((_pos, index) => {
      if (_pos <= position && position <= pos[index + 1]) {
        console.log("FOUND SEGMENT: ", index, " FOR ", position)
        const beginTime = timestamp[index];
        const endTime = timestamp[index + 1];
        const time = parseInt((beginTime + (position - _pos) / ratios[index] * (endTime - beginTime)) * 1000); //time, in milisecond
        setHoverTime({ time: convertEpoch(time), mouseX });
        return;
      }
    })
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
      {console.log("new ratio:", ratios)}
      {console.log("new pos: ", pos)}
      {ratios.map((ratio, index) => {
        if (index % 2 === 0) {
          console.log(pos[index] * 0.9 + 5, ratio * 0.9)
          return (
            <>
              <div
                key={index}
                style={{
                  left: `${pos[index] * 0.9 + 5}%`,
                  width: `${ratio * 0.9}%`,
                  position: "absolute"
                }}
                className={`range active`}
              // onMouseEnter={() =>
              //   setHoverInfo({ start, end })
              // }
              // onMouseLeave={() => setHoverInfo(null)}
              >
                <div
                  className="dot"
                  style={{ left: `0%` }}
                />

                <div
                  className="dot"
                  style={{ left: `100%` }}
                />


                <div
                  className="slider-label"
                  style={{ left: `${pos[index] * 0.9 + 5}%` }}
                >
                  Start: {convertEpoch(timestamp[index] * 1000)}
                </div>


                  <div
                    className="slider-label"
                    style={{ left: `$${pos[index + 1] * 0.9 + 5}%` }}
                  >
                  End: {convertEpoch(timestamp[index + 1] * 1000)}
                  </div>

                {
                  hoverInfo && (
                    <div
                      className="popup"
                      style={{ left: `${calculatePosition(hoverInfo.start)}%` }}
                    >
                      Start: {hoverInfo.start}, End: {hoverInfo.end}, Status:{" "}
                      {hoverInfo.active ? "Active" : "Inactive"}
                    </div>
                  )
                }
                {
                  hoverTime &&
                  <div className="popup" style={{ left: `${hoverTime.mouseX}px`, marginTop: "50px" }}>
                    {`Time: ${hoverTime.time}`}
                  </div>
                }
              </div>
            </>
          )

        }
      }
      )}
    </div>


  );

}

export default TimeSlider;
