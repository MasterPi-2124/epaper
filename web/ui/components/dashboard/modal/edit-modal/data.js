import React, { useEffect, useState, useRef } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import { Input, Switch, Popover } from "@nextui-org/react";
import { WheelPicker } from "@/components/new-data/WheelPicker";
import { Dropdown } from "@nextui-org/react";
import { Notify } from "notiflix";
import dayjs from "dayjs";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const Data = ({ dataUpdated, handleSubmit, handleChange }) => {
  const [deviceLoading, setDeviceLoading] = useState(0);
  const [dataStage, setDataStage] = useState(0);
  const canvaRef = useRef(null);
  const [devices, setDevices] = useState();
  const fonts = [ "Monospace 12pt",
                  "Monospace 16pt",
                  "Monospace 20pt",
                  "Segoe UI Light, 11pt",
                  "Segoe UI Bold, 11pt",
                  "Segoe UI Light, 16pt",
                  "Segoe UI Bold, 16pt",
                  "Segoe UI Light, 20pt",
  ]
  const themes = ["Theme 1",
                  "Theme 2"
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
      Notify.info("Fetching for all active devices", {
        className: "notiflix-info",
        timeout: 6500,
    });
      await instanceCoreApi.get(`${API}/devices?active=true`).then((res) => {
        setDevices(res.data.data);
        Notify.success(`Fetched all active devices successfully!`, {
          className: "notiflix-success",
      });
        setDeviceLoading(1);
      })
    } catch (err) {
      console.error(err);
      setDeviceLoading(-1);
      Notify.failure(`Error fetching active devices data: ${err}`, {
        className: "notiflix-failure"
    });
    }
  }

  useEffect(() => {
    if (dataStage === 1) {
      getActiveDevices();
    }
  }, [dataStage]);

  useEffect(() => {
    if (dataUpdated["active"]) {
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
    if (dataStage === 1) {
      const canva = canvaRef.current;
      const ctx = canva.getContext("2d");

      ctx.clearRect(0, 0, canva.width, canva.height);

      if (dataUpdated.designSchema === "Theme 1") {
        style["color"] = "black";
      } else if (dataUpdated.designSchema === "Theme 2") {
          style["color"] = "blue";
      } else if (dataUpdated.designSchema === "Theme 3") {
          style["color"] = "yellow";
      } else {
          style["color"] = "black"; // default to Theme 1
      }

      if (dataUpdated.fontStyle === "Monospace 12pt") {
        style["font"] = "12px monospace";
    } else if (dataUpdated.fontStyle === "Monospace 16pt") {
        style["font"] = "16px monospace";
    } else if (dataUpdated.fontStyle === "Monospace 20pt") {
        style["font"] = "24px monospace";
    } else if (dataUpdated.fontStyle === "Segoe UI Light, 11pt") {
        style["font"] = "200 12px Segoe UI";
    } else if (dataUpdated.fontStyle === "Segoe UI Bold, 11pt") {
        style["font"] = "bold 20px Segoe UI";
    } else if (dataUpdated.fontStyle === "Segoe UI Light, 16pt") {
        style["font"] = "200 24px Segoe UI";
    }  else if (dataUpdated.fontStyle === "Segoe UI Bold, 16pt") {
        style["font"] = "bold 24px Segoe UI";
    }  else if (dataUpdated.fontStyle === "Segoe UI Light, 20pt") {
        style["font"] = "200 36px Segoe UI";
    } else {
        style["font"] = "bold 24px Segoe UI"; // default to Segoe UI Bold, 16pt
    }

      if (dataUpdated.type === "Product") {
        if (dataUpdated.designSchema === "Theme 1") {
            ctx.font = '200 12px Segoe UI';
            ctx.fillStyle = style.color;
            ctx.fillText(`${dataUpdated.input2}`, 10, 40);

            ctx.font = style.font;
            ctx.fillStyle = style.color;
            ctx.fillText(`${dataUpdated.name}`, 10, 70);

            ctx.font = "bold 36px Segoe UI";
            ctx.fillStyle = style.color;
            ctx.fillText(`${dataUpdated.input3}`, 120, 90);
        } else if (dataUpdated.designSchema === "Theme 2") {
            ctx.font = style.font;
            ctx.fillStyle = style.color;
            ctx.fillText(`${dataUpdated.input2}`, 10, 30);

            ctx.font = style.font;
            ctx.fillStyle = style.color;
            ctx.fillText(`${dataUpdated.name}`, 10, 60);

            ctx.font = style.font;
            ctx.fillStyle = style.color;
            ctx.fillText(`Email: ${dataUpdated.input3}`, 10, 90);
        }
      } else if (dataUpdated.type === "Client") {
          ctx.font = style.font;
          ctx.fillStyle = style.color;
          ctx.fillText(`Name: ${dataUpdated.name}`, 10, 30);
          ctx.fillText(`Email: ${dataUpdated.email}`, 10, 60);
      } else if (dataUpdated.type === "Student") {
          ctx.font = style.font;
          ctx.fillStyle = style.color;
          ctx.fillText(`Name: ${dataUpdated.name}`, 10, 30);
          ctx.fillText(`Email: ${dataUpdated.email}`, 10, 60);
      } else if (dataUpdated.type === "Employee") {
          ctx.font = style.font;
          ctx.fillStyle = style.color;
          ctx.fillText(`Name: ${dataUpdated.name}`, 10, 30);
          ctx.fillText(`Email: ${dataUpdated.email}`, 10, 60);
      } else if (dataUpdated.type === "Room") {
          ctx.font = style.font;
          ctx.fillStyle = style.color;
          ctx.fillText(`Name: ${dataUpdated.name}`, 10, 30);
          ctx.fillText(`Email: ${dataUpdated.email}`, 10, 60);
      }
    }
  }, [style, dataUpdated, dataStage])

  return (
    (dataStage ? (
      <>
        <canvas className="render-canvas" ref={canvaRef} width="340" height="150" />
        <form className="form" onSubmit={handleSubmit}>
          <label className="dark:text-dark-text text-light-text">Choose a device, font style and theme to display. Example view will be displayed above.</label>
          <Dropdown>
            <Dropdown.Button flat className="devices-choices">
              {(dataUpdated.deviceID !== "") ? dataUpdated.deviceName : 'Choose a device'}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="primary"
              items={devices}
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={dataUpdated.deviceID}
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
              {(dataUpdated.fontStyle !== "") ? dataUpdated.fontStyle : 'Choose a font'}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="primary"
              items={fonts}
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={dataUpdated.fontStyle}
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
              {(dataUpdated.designSchema !== "") ? dataUpdated.designSchema : 'Choose a theme'}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="primary"
              items={themes}
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={dataUpdated.designSchema}
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


          {console.log(`Name: `, dataUpdated.name)}
          {console.log(`Email: `, dataUpdated.email)}
          {console.log(`Address: `, dataUpdated.address)}
          {console.log(`Write on EPD?: `, dataUpdated.active)}
          {console.log(`Device: `, dataUpdated.deviceID)}
          {console.log(`Font: `, dataUpdated.fontStyle)}
          {console.log(`Theme: `, dataUpdated.designSchema)}

          <button type="submit">Submit</button>
          <button onClick={() => setDataStage(0)}>Back</button>
        </form>
      </>
    ) : (
      <form className="form" onSubmit={handleSubmit}>
        <Input
          className="input"
          required
          label="Name"
          type="text"
          initialValue={dataUpdated.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {dataUpdated.type === "Client" ? (
          <>
            <Input
              className="input"
              label="Email"
              required
              initialValue={dataUpdated.email}
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              className="input"
              label="Address"
              required
              initialValue={dataUpdated.input2}
              type="text"
              onChange={(e) => handleChange("input2", e.target.value)}
            />
          </>
        ) : dataUpdated.type === "Student" ? (
          <>
            <Input
              className="input"
              required
              label="Email"
              type="email"
              initialValue={dataUpdated.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              className="input"
              label="Student ID"
              required
              type="text"
              initialValue={dataUpdated.input2}
              onChange={(e) => handleChange("input2", e.target.value)}
            />

            <Input
              className="input"
              label="Class"
              required
              type="text"
              initialValue={dataUpdated.input3}
              onChange={(e) => handleChange("input3", e.target.value)}
            />
          </>
        ) : dataUpdated.type === "Product" ? (
          <>
            <Input
              className="input"
              label="Category"
              required
              type="text"
              initialValue={dataUpdated.input2}
              onChange={(e) => handleChange("input2", e.target.value)}
            />

            <Input
              className="input"
              label="Price"
              required
              type="text"
              initialValue={dataUpdated.input3}
              onChange={(e) => handleChange("input3", e.target.value)}
            />
          </>
        ) : dataUpdated.type === "Employee" ? (
          <>
            <Input
              className="input"
              label="Email"
              required
              type="email"
              initialValue={dataUpdated.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              className="input"
              label="Employee ID"
              required
              type="text"
              initialValue={dataUpdated.input2}
              onChange={(e) => handleChange("input2", e.target.value)}
            />

            <Input
              className="input"
              label="Department"
              required
              type="text"
              initialValue={dataUpdated.input3}
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
              initialValue={dataUpdated.input2}
              onChange={(e) => handleChange("input2", e.target.value)}
            />

            <Input
              className="input"
              required
              label="Manager"
              type="text"
              initialValue={dataUpdated.input3}
              onChange={(e) => handleChange("input3", e.target.value)}
            />

            <Input
              className="input"
              label="Status"
              required
              type="text"
              initialValue={dataUpdated.input4}
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
            initialChecked={dataUpdated.active}
            onChange={(e) => handleChange("active", e.target.checked)}
          />
        </div>

        {dataUpdated.active &&
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
        {dataUpdated.active ? (
          <button className="ok" type="button" onClick={() => {
            setDataStage(1);
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

export default Data;
