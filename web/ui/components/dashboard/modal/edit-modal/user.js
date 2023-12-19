import React, { useEffect, useState, useRef } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import { Input, Switch, Popover } from "@nextui-org/react";
import { WheelPicker } from "@/components/new-user/WheelPicker";
import { Dropdown } from "@nextui-org/react";
import { Notify } from "notiflix";
import dayjs from "dayjs";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const User = ({ userUpdated, handleSubmit, handleChange }) => {
  const [deviceLoading, setDeviceLoading] = useState(0);
  const [userStage, setUserStage] = useState(0);
  const canvaRef = useRef(null);
  const [devices, setDevices] = useState();
  const fonts = [
    "Monospace 8pt",
    "Monospace 12pt",
    "Monospace 16pt",
    "Monospace 24pt",
    "Segoe UI 8pt",
    "Segoe UI 12pt",
    "Segoe UI 16pt",
    "Segoe UI 20pt",
  ]
  const themes = [
    "Theme 1",
    "Theme 2",
    "Theme 3",
    "Theme 4",
  ]

  const style = {
    font: "",
    color: "",
  };

  const hourItems = Array.from({ length: 12 }, (_, index) => ({
    value: `${(index + 1).toString().padStart(2, "0")}`,
    label: `${(index + 1).toString().padStart(2, "0")}`
  }));

  const minuteItems = Array.from({ length: 12 }, (_, index) => ({
    value: `${(index * 5).toString().padStart(2, "0")}`,
    label: `${(index * 5).toString().padStart(2, "0")}`
  }));

  const ampmItems = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" }
  ];

  const dateItems = Array.from({ length: 10 }, (_, i) => {
    const date = dayjs().add(0, "days").add(i, "days");
    return {
      value: date.startOf("day").format("YYYY-MM-DD"),
      label: 0 === i ? "Today" : date.format("ddd, DD MMM")
    };
  });

  const [date, setDate] = useState(dateItems[0].value);
  const [hour, setHour] = useState(Math.abs(new Date().getHours() % 12));
  const [minute, setMinute] = useState(new Date().getMinutes() - (new Date().getMinutes() % 5));
  const [ampm, setAmpm] = useState(new Date().getHours() > 12 ? "PM" : "AM");

  const getActiveDevices = async () => {
    try {
      await instanceCoreApi.get(`${API}/devices?active=true`).then((res) => {
        setDevices(res.data.data);
        Notify.success(`Fetched all active devices successfully!`);
        setDeviceLoading(1);
      })
    }
    catch (err) {
      console.error(err);
      setDeviceLoading(-1);
      Notify.failure(`Error fetching active devices data: ${err}`);
    }
  }

  useEffect(() => {
    if (userStage === 1) {
      getActiveDevices();
    }
  }, [userStage]);

  useEffect(() => {
    if (userUpdated["active"]) {
      let hr = "";
      if (ampm === "AM") {
        if (hour === "12") {
          hr = "00";
        } else {
          hr = hour.toString();
        }
      } else {
        if (hour === "12") {
          hr = "12";
        } else {
          hr = (parseInt(hour, 10) + 12).toString();
        }
      }
      const dd = new Date(`${date} ${hr}:${minute}`);
      handleChange("activeStartTime", Math.floor(dd.getTime() / 1000));
    }
  }, [date, hour, minute, ampm]);

  useEffect(() => {
    if (userStage === 1) {
      const canva = canvaRef.current;
      const ctx = canva.getContext("2d");

      ctx.clearRect(0, 0, canva.width, canva.height);

      if (userUpdated.designSchema === "Theme 1") {
        style["color"] = "red";
      } else if (userUpdated.designSchema === "Theme 2") {
        style["color"] = "blue";
      } else if (userUpdated.designSchema === "Theme 3") {
        style["color"] = "yellow";
      } else {
        style["color"] = "orange";
      }

      if (userUpdated.fontStyle === "Monospace 8pt") {
        style["font"] = "8px Times New Roman";
      } else if (userUpdated.fontStyle === "Monospace 12pt") {
        style["font"] = "12px Segoe UI";
      } else if (userUpdated.fontStyle === "Monospace 16pt") {
        style["font"] = "16px";
      } else if (userUpdated.fontStyle === "Monospace 24pt") {
        style["font"] = "24px";
      } else if (userUpdated.fontStyle === "Segoe UI 8pt") {
        style["font"] = "28px";
      } else if (userUpdated.fontStyle === "Segoe UI 12pt") {
        style["font"] = "32px";
      } else if (userUpdated.fontStyle === "Segoe UI 16pt") {
        style["font"] = "36px";
      } else {
        style["font"] = "40px Segoe UI";
      }

      ctx.font = style.font;
      ctx.fillStyle = style.color;
      ctx.fillText(`Name: ${userUpdated.name}`, 10, 30);
      ctx.fillText(`Email: ${userUpdated.email}`, 10, 60);
    }
  }, [style, userUpdated, userStage])

  return (
    (userStage ? (
      <>
        <canvas className="render-canvas" ref={canvaRef} width="340" height="150" />
        <form className="form" onSubmit={handleSubmit}>
          <label className="dark:text-dark-text text-light-text">Choose a device, and theme to display. Example view will be displayed above.</label>
          <Dropdown>
            <Dropdown.Button flat className="devices-choices">
              {(userUpdated.deviceID !== "") ? userUpdated.deviceName : 'Choose a device'}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="primary"
              items={devices}
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={userUpdated.deviceID}
            >
              {(deviceLoading && devices.length) ? (
                devices?.map((device) =>
                  <Dropdown.Item key={device._id}>
                    <button
                      onClick={(e) => {
                        handleChange("deviceID", device._id);
                        handleChange("deviceName", device.name);
                      }}
                      style={{
                        padding: "10px 0px"
                      }}
                      className="w-full dropdown-item"
                    >
                      <p style={{
                        textAlign: "left",
                        color: "white"
                      }}
                      >
                        {device.name}
                      </p>
                      <p style={{
                        textAlign: "left",
                        color: "rgb(177, 177, 177)",
                        fontSize: "10px"
                      }}
                      >
                        Device ID: {device._id}
                      </p>
                    </button>
                  </Dropdown.Item>
                )
              ) : deviceLoading === 0 ? (
                <Dropdown.Item style={{ color: "white" }} >
                  Getting active devices ...
                </Dropdown.Item>
              ) : (
                <Dropdown.Item>
                  No active devices are found!
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Button flat className="devices-choices">
              {(userUpdated.fontStyle !== "") ? userUpdated.fontStyle : 'Choose a font'}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="primary"
              items={fonts}
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={userUpdated.fontStyle}
            >
              {fonts?.map((font) => {
                return <Dropdown.Item key={font}>
                  <button
                    onClick={(e) => handleChange("fontStyle", font)}
                    style={{
                      padding: "10px 0px"
                    }}
                    className="w-full dropdown-item"
                  >
                    <p style={{
                      textAlign: "left",
                      color: "white"
                    }}
                    >
                      {font}
                    </p>
                  </button>
                </Dropdown.Item>
              })}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Button flat className="devices-choices">
              {(userUpdated.designSchema !== "") ? userUpdated.designSchema : 'Choose a theme'}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="primary"
              items={themes}
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={userUpdated.designSchema}
            >
              {themes?.map((theme) => {
                return <Dropdown.Item key={theme}>
                  <button
                    onClick={(e) => handleChange("designSchema", theme)}
                    style={{
                      padding: "10px 0px"
                    }}
                    className="w-full dropdown-item"
                  >
                    <p style={{
                      textAlign: "left",
                      color: "white"
                    }}
                    >
                      {theme}
                    </p>

                  </button>
                </Dropdown.Item>
              })}
            </Dropdown.Menu>
          </Dropdown>


          {console.log(`Name: `, userUpdated.name)}
          {console.log(`Email: `, userUpdated.email)}
          {console.log(`Address: `, userUpdated.address)}
          {console.log(`Write on EPD?: `, userUpdated.active)}
          {console.log(`Device: `, userUpdated.deviceID)}
          {console.log(`Font: `, userUpdated.fontStyle)}
          {console.log(`Theme: `, userUpdated.designSchema)}

          <button type="submit">Submit</button>
          <button onClick={() => setUserStage(0)}>Back</button>
        </form>
      </>
    ) : (
      <form className="form" onSubmit={handleSubmit}>
        <Input
          className="input"
          required
          label="Name"
          type="text"
          initialValue={userUpdated.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {userUpdated.type === "Client" ? (
          <>
            <Input
              className="input"
              label="Email"
              required
              initialValue={userUpdated.email}
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              className="input"
              label="Address"
              required
              initialValue={userUpdated.input2}
              type="text"
              onChange={(e) => handleChange("input2", e.target.value)}
            />
          </>
        ) : userUpdated.type === "Student" ? (
          <>
            <Input
              className="input"
              required
              label="Email"
              type="email"
              initialValue={userUpdated.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              className="input"
              label="Student ID"
              required
              type="text"
              initialValue={userUpdated.input2}
              onChange={(e) => handleChange("input2", e.target.value)}
            />

            <Input
              className="input"
              label="Class"
              required
              type="text"
              initialValue={userUpdated.input3}
              onChange={(e) => handleChange("input3", e.target.value)}
            />
          </>
        ) : userUpdated.type === "Product" ? (
          <>
            <Input
              className="input"
              label="Category"
              required
              type="text"
              initialValue={userUpdated.input2}
              onChange={(e) => handleChange("input2", e.target.value)}
            />

            <Input
              className="input"
              label="Price"
              required
              type="text"
              initialValue={userUpdated.input3}
              onChange={(e) => handleChange("input3", e.target.value)}
            />
          </>
        ) : userUpdated.type === "Employee" ? (
          <>
            <Input
              className="input"
              label="Email"
              required
              type="email"
              initialValue={userUpdated.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              className="input"
              label="Employee ID"
              required
              type="text"
              initialValue={userUpdated.input2}
              onChange={(e) => handleChange("input2", e.target.value)}
            />

            <Input
              className="input"
              label="Department"
              required
              type="text"
              initialValue={userUpdated.input3}
              onChange={(e) => handleChange("input3", e.target.value)}
            />
          </>
        ) : (
          <>
            <Input
              className="input"
              required
              label="Purpose"
              type="text"
              initialValue={userUpdated.input2}
              onChange={(e) => handleChange("input2", e.target.value)}
            />

            <Input
              className="input"
              required
              label="Manager"
              type="text"
              initialValue={userUpdated.input3}
              onChange={(e) => handleChange("input3", e.target.value)}
            />

            <Input
              className="input"
              label="Status"
              required
              type="text"
              initialValue={userUpdated.input4}
              onChange={(e) => handleChange("input4", e.target.value)}
            />
          </>
        )}

        <div className="switch">
          <label style={{
            fontSize: "14px",
          }}
          >
            Display on EPD?
          </label>
          <Switch
            className="input"
            bordered
            label="EPD display?"
            initialChecked={userUpdated.active}
            onChange={(e) => handleChange("active", e.target.checked)}
          />
        </div>

        {userUpdated.active &&
          <div>
            <p style={{
              fontSize: "14px",
            }}
            >
              Active start time
            </p>
            <Popover placement="bottom" showArrow>
              <Popover.Trigger>
                <a style={{
                  width: "100%",
                  height: "40px",
                  paddingLeft: "10px",
                  lineHeight: "40px",
                  borderRadius: "14px",
                  backgroundColor: "#7c7c7c44",
                  fontWeight: "200",
                  fontSize: "13px",
                  marginTop: "5px",
                }}>
                  {date} {hour}:{minute} {ampm}
                </a>
              </Popover.Trigger>
              <Popover.Content>
                <WheelPicker
                  dateItems={dateItems}
                  dateValue={date}
                  onDateChange={setDate}
                  hourItems={hourItems}
                  hourValue={hour}
                  onHourChange={setHour}
                  minuteItems={minuteItems}
                  minuteValue={minute}
                  onMinuteChange={setMinute}
                  ampmItems={ampmItems}
                  ampmValue={ampm}
                  onAmpmChange={setAmpm}
                />
              </Popover.Content>
            </Popover>

          </div>
        }
        <br />
        {userUpdated.active ? (
          <button className="ok" type="button" onClick={() => {
            setUserStage(1);
          }}>
            Continue
          </button>
        ) : (
          <button className="ok" type="submit" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </form>
    ))
  )
}

export default User;
