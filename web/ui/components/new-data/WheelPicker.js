import React, { useEffect, useMemo, useRef } from "react";

const WheelPickerComponent = ({
  dateItems,
  dateValue,
  onDateChange: handleDateChange,
  hourItems,
  hourValue,
  onHourChange: handleHourChange,
  minuteItems,
  minuteValue,
  onMinuteChange: handleMinuteChange,
  ampmItems,
  ampmValue,
  onAmpmChange: handleAmpmChange,
  containerHeight = 210,
  itemHeight = 32
}) => {
  const hourItemsContRef = useRef();
  const dateItemsContRef = useRef();
  const minuteItemsContRef = useRef();
  const ampmItemsContRef = useRef();
  const isScrolling = useRef(false);
  const dateRefs = useRef([]);
  const hourRefs = useRef([]);
  const minuteRefs = useRef([]);
  const ampmRefs = useRef([]);
  const dateItemsMap = useMemo(
    () =>
      dateItems.reduce(
        (map, item, index) => map.set(item.value, index),
        new Map()
      ),
    [dateItems]
  );
  const currentDateValue = useRef(dateItemsMap.get(dateValue) ?? 0);
  const hourItemsMap = useMemo(
    () =>
      hourItems.reduce(
        (map, item, index) => map.set(item.value, index),
        new Map()
      ),
    [hourItems]
  );
  const currentHourValue = useRef(hourItemsMap.get(hourValue) ?? 0);
  const minuteItemsMap = useMemo(
    () =>
      minuteItems.reduce(
        (map, item, index) => map.set(item.value, index),
        new Map()
      ),
    [minuteItems]
  );
  const currentMinuteValue = useRef(minuteItemsMap.get(minuteValue) ?? 0);
  const ampmItemsMap = useMemo(
    () =>
      ampmItems.reduce(
        (map, item, index) => map.set(item.value, index),
        new Map()
      ),
    [ampmItems]
  );
  const currentAmpmValue = useRef(ampmItemsMap.get(ampmValue) ?? 0);

  const visibleItemsCount = Math.floor(containerHeight / itemHeight);
  const offset = Math.round((visibleItemsCount + 1) / 2) + 1;
  const maxScrollOffset = (containerHeight - itemHeight) / 2;

  function rerenderDateElements(
    selectedElement,
    scrollTop,
    firstItemIndex = Math.max(selectedElement - offset, 0),
    lastItemIndex = Math.min(selectedElement + offset, dateItems.length)
  ) {
    if (dateRefs.current) {
      dateRefs.current
        .slice(firstItemIndex, lastItemIndex)
        .forEach((item, index) => {
          const realIndex = index + firstItemIndex;
          const scrollOffset = Math.min(
            Math.abs(scrollTop - realIndex * itemHeight - itemHeight / 2),
            maxScrollOffset
          );
          const sin = scrollOffset / maxScrollOffset;
          const cos = Math.sqrt(1 - sin ** 2);
          const [div] = item.getElementsByTagName("div");
          div.style.transform = `rotateX(${Math.asin(sin)}rad) scale(${cos})`;
          div.style.transformOrigin = "right";
        });
    }
  }

  function rerenderHourElements(
    selectedElement,
    scrollTop,
    firstItemIndex = Math.max(selectedElement - offset, 0),
    lastItemIndex = Math.min(selectedElement + offset, dateItems.length)
  ) {
    if (hourRefs.current) {
      hourRefs.current
        .slice(firstItemIndex, lastItemIndex)
        .forEach((item, index) => {
          const realIndex = index + firstItemIndex;
          const scrollOffset = Math.min(
            Math.abs(scrollTop - realIndex * itemHeight - itemHeight / 2),
            maxScrollOffset
          );
          const sin = scrollOffset / maxScrollOffset;
          const cos = Math.sqrt(1 - sin ** 2);
          const [div] = item.getElementsByTagName("div");
          div.style.transform = `rotateX(${Math.asin(sin)}rad) scale(${cos})`;
          div.style.transformOrigin = "center";
        });
    }
  }

  function rerenderMinuteElements(
    selectedElement,
    scrollTop,
    firstItemIndex = Math.max(selectedElement - offset, 0),
    lastItemIndex = Math.min(selectedElement + offset, dateItems.length)
  ) {
    if (minuteRefs.current) {
      minuteRefs.current
        .slice(firstItemIndex, lastItemIndex)
        .forEach((item, index) => {
          const realIndex = index + firstItemIndex;
          const scrollOffset = Math.min(
            Math.abs(scrollTop - realIndex * itemHeight - itemHeight / 2),
            maxScrollOffset
          );
          const sin = scrollOffset / maxScrollOffset;
          const cos = Math.sqrt(1 - sin ** 2);
          const [div] = item.getElementsByTagName("div");
          div.style.transform = `rotateX(${Math.asin(sin)}rad) scale(${cos})`;
          div.style.transformOrigin = "left";
        });
    }
  }

  function rerenderAmpmElements(
    selectedElement,
    scrollTop,
    firstItemIndex = Math.max(selectedElement - offset, 0),
    lastItemIndex = Math.min(selectedElement + offset, dateItems.length)
  ) {
    if (ampmRefs.current) {
      ampmRefs.current
        .slice(firstItemIndex, lastItemIndex)
        .forEach((item, index) => {
          const realIndex = index + firstItemIndex;
          const scrollOffset = Math.min(
            Math.abs(scrollTop - realIndex * itemHeight - itemHeight / 2),
            maxScrollOffset
          );
          const sin = scrollOffset / maxScrollOffset;
          const cos = Math.sqrt(1 - sin ** 2);
          const [div] = item.getElementsByTagName("div");
          div.style.transform = `rotateX(${Math.asin(sin)}rad) scale(${cos})`;
          div.style.transformOrigin = "left";
        });
    }
  }

  useEffect(() => {
    let isAnimating = false;

    function handleHourScroll(event) {
      if (!isAnimating) {
        isAnimating = true;

        requestAnimationFrame(() => {
          const scrollTop = Math.max(event.target.scrollTop, 0);
          const selectedElement = Math.min(
            Math.max(Math.floor(scrollTop / itemHeight), 0),
            hourItems.length - 1
          );
          window.clearTimeout(isScrolling.current);
          rerenderHourElements(selectedElement, scrollTop);

          currentHourValue.current = selectedElement;
          isScrolling.current = setTimeout(function () {
            handleHourChange(hourItems[selectedElement].value);
          }, 20);

          isAnimating = false;
        });
      }
    }

    hourItemsContRef.current?.addEventListener("scroll", handleHourScroll);
    hourRefs.current[currentDateValue.current]?.scrollIntoView({
      block: "center"
    });
    rerenderHourElements(
      currentHourValue.current,
      hourItemsContRef.current?.scrollTop,
      0,
      hourItems.length
    );
    return () => {
      hourItemsContRef.current?.removeEventListener("scroll", handleHourScroll);
    };
  }, [hourItemsContRef.current]);

  useEffect(() => {
    let isAnimating = false;

    function handleDateScroll(event) {
      if (!isAnimating) {
        isAnimating = true;

        requestAnimationFrame(() => {
          const scrollTop = Math.max(event.target.scrollTop, 0);
          const selectedElement = Math.min(
            Math.max(Math.floor(scrollTop / itemHeight), 0),
            dateItems.length - 1
          );
          window.clearTimeout(isScrolling.current);
          rerenderDateElements(selectedElement, scrollTop);

          currentDateValue.current = selectedElement;
          isScrolling.current = setTimeout(function () {
            handleDateChange(dateItems[selectedElement].value);
          }, 20);

          isAnimating = false;
        });
      }
    }

    dateItemsContRef.current?.addEventListener("scroll", handleDateScroll);
    dateRefs.current[currentDateValue.current]?.scrollIntoView({
      block: "center"
    });
    rerenderDateElements(
      currentDateValue.current,
      dateItemsContRef.current?.scrollTop,
      0,
      dateItems.length
    );

    return () => {
      dateItemsContRef.current?.removeEventListener("scroll", handleDateScroll);
    };
  }, [dateItemsContRef.current]);

  useEffect(() => {
    let isAnimating = false;

    function handleMinuteScroll(event) {
      if (!isAnimating) {
        isAnimating = true;

        requestAnimationFrame(() => {
          const scrollTop = Math.max(event.target.scrollTop, 0);
          const selectedElement = Math.min(
            Math.max(Math.floor(scrollTop / itemHeight), 0),
            minuteItems.length - 1
          );
          window.clearTimeout(isScrolling.current);
          rerenderMinuteElements(selectedElement, scrollTop);

          currentMinuteValue.current = selectedElement;
          isScrolling.current = setTimeout(function () {
            handleMinuteChange(minuteItems[selectedElement].value);
          }, 20);

          isAnimating = false;
        });
      }
    }

    minuteItemsContRef.current?.addEventListener("scroll", handleMinuteScroll);
    minuteRefs.current[currentDateValue.current]?.scrollIntoView({
      block: "center"
    });
    rerenderMinuteElements(
      currentMinuteValue.current,
      minuteItemsContRef.current?.scrollTop,
      0,
      minuteRefs.length
    );
    return () => {
      minuteItemsContRef.current?.removeEventListener(
        "scroll",
        handleMinuteScroll
      );
    };
  }, [minuteItemsContRef.current]);

  useEffect(() => {
    let isAnimating = false;

    function handleAmpmScroll(event) {
      if (!isAnimating) {
        isAnimating = true;

        requestAnimationFrame(() => {
          const scrollTop = Math.max(event.target.scrollTop, 0);
          const selectedElement = Math.min(
            Math.max(Math.floor(scrollTop / itemHeight), 0),
            ampmItems.length - 1
          );
          window.clearTimeout(isScrolling.current);
          rerenderAmpmElements(selectedElement, scrollTop);

          currentAmpmValue.current = selectedElement;
          isScrolling.current = setTimeout(function () {
            handleAmpmChange(ampmItems[selectedElement].value);
          }, 20);

          isAnimating = false;
        });
      }
    }

    ampmItemsContRef.current?.addEventListener("scroll", handleAmpmScroll);
    ampmRefs.current[currentDateValue.current]?.scrollIntoView({
      block: "center"
    });
    rerenderAmpmElements(
      currentAmpmValue.current,
      ampmItemsContRef.current?.scrollTop,
      0,
      ampmRefs.length
    );
    return () => {
      ampmItemsContRef.current?.removeEventListener("scroll", handleAmpmScroll);
    };
  }, [ampmItemsContRef.current]);

  useEffect(() => {
    const index = dateItemsMap.get(dateValue);
    if (index !== currentDateValue.current) {
      currentDateValue.current = index;
      dateRefs.current[index]?.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
      rerenderDateElements(
        currentDateValue.current,
        dateItemsContRef.current?.scrollTop,
        0,
        dateItems.length
      );
    }
  }, [dateValue]);

  useEffect(() => {
    const index = hourItemsMap.get(hourValue);
    if (index !== currentHourValue.current) {
      currentHourValue.current = index;
      hourRefs.current[index]?.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
      rerenderDateElements(
        currentHourValue.current,
        hourItemsContRef.current?.scrollTop,
        0,
        hourItems.length
      );
    }
  }, [hourValue]);

  useEffect(() => {
    const index = minuteItemsMap.get(minuteValue);
    if (index !== currentMinuteValue.current) {
      currentMinuteValue.current = index;
      minuteRefs.current[index]?.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
      rerenderDateElements(
        currentMinuteValue.current,
        minuteItemsContRef.current?.scrollTop,
        0,
        minuteItems.length
      );
    }
  }, [minuteValue]);

  useEffect(() => {
    const index = ampmItemsMap.get(ampmValue);
    if (index !== currentAmpmValue.current) {
      currentAmpmValue.current = index;
      ampmRefs.current[index]?.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
      rerenderDateElements(
        currentAmpmValue.current,
        ampmItemsContRef.current?.scrollTop,
        0,
        ampmItems.length
      );
    }
  }, [ampmValue]);

  return (
    <div
      className="wheelpicker-container"
      style={{
        height: `${containerHeight}px`
      }}
    >
      <ul className="wheelpicker-items" ref={dateItemsContRef}>
        {dateItems.map((item, index) => (
          <li
            className="wheelpicker-item"
            key={item.value}
            ref={(node) => (dateRefs.current[index] = node)}
            style={{
              height: `${itemHeight}px`,
              lineHeight: `${itemHeight}px`
            }}
          >
            <div>{item.label}</div>
          </li>
        ))}
      </ul>
      <ul className="wheelpicker-items" ref={hourItemsContRef}>
        {hourItems.map((item, index) => (
          <li
            className="wheelpicker-item"
            key={item.value}
            ref={(node) => (hourRefs.current[index] = node)}
            style={{
              height: `${itemHeight}px`,
              lineHeight: `${itemHeight}px`
            }}
          >
            <div>{item.label}</div>
          </li>
        ))}
      </ul>
      <ul className="wheelpicker-items" ref={minuteItemsContRef}>
        {minuteItems.map((item, index) => (
          <li
            className="wheelpicker-item"
            key={item.value}
            ref={(node) => (minuteRefs.current[index] = node)}
            style={{
              height: `${itemHeight}px`,
              lineHeight: `${itemHeight}px`
            }}
          >
            <div>{item.label}</div>
          </li>
        ))}
      </ul>
      <ul className="wheelpicker-items" ref={ampmItemsContRef}>
        {ampmItems.map((item, index) => (
          <li
            className="wheelpicker-item"
            key={item.value}
            ref={(node) => (ampmRefs.current[index] = node)}
            style={{
              height: `${itemHeight}px`,
              lineHeight: `${itemHeight}px`
            }}
          >
            <div>{item.label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const WheelPicker = React.memo(WheelPickerComponent);
