import React, { useEffect, useState } from "react";
import { instanceCoreApi } from "@/services/setupAxios";
import Image from "next/image";
import Notify from 'notiflix/build/notiflix-notify-aio';
import { Table, Input, Switch, Popover } from "@nextui-org/react";
import { WheelPicker } from "@/components/new-user/WheelPicker";
import { Dropdown } from "@nextui-org/react";
import dayjs from "dayjs";

const API = process.env.NEXT_PUBLIC_API || "http://65.108.79.164:3007/api";

const EditModal = ({ type, id, onClose }) => {
  const [port, setPort] = useState(null);
  const [item, setItem] = useState({});
  const [itemUpdated, setItemUpdated] = useState({});
  const [userStage, setUserStage] = useState(0);
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
  const canvaRef = useRef(null);

  const style = {
    font: "",
    color: "",
  };

  const handleChange = (param, value) => {
    let userTyped = {};
    userTyped[param] = value;
    setItemUpdated(itemUpdated => ({
      ...itemUpdated,
      ...userTyped
    }))
  }

  const getDevices = async () => {
    try {
      await instanceCoreApi.get(`${API}/devices`).then((res) => {
        setDevices(res.data.data)
      })
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    const canva = canvaRef.current;
    const ctx = canva.getContext("2d");

    ctx.clearRect(0, 0, canva.width, canva.height);

    if (userCreated.designSchema === "Theme 1") {
      style["color"] = "red";
    } else if (userCreated.designSchema === "Theme 2") {
      style["color"] = "blue";
    } else if (userCreated.designSchema === "Theme 3") {
      style["color"] = "yellow";
    } else {
      style["color"] = "orange";
    }

    if (userCreated.fontStyle === "Monospace 8pt") {
      style["font"] = "8px Times New Roman";
    } else if (userCreated.fontStyle === "Monospace 12pt") {
      style["font"] = "12px Segoe UI";
    } else if (userCreated.fontStyle === "Monospace 16pt") {
      style["font"] = "16px";
    } else if (userCreated.fontStyle === "Monospace 24pt") {
      style["font"] = "24px";
    } else if (userCreated.fontStyle === "Segoe UI 8pt") {
      style["font"] = "28px";
    } else if (userCreated.fontStyle === "Segoe UI 12pt") {
      style["font"] = "32px";
    } else if (userCreated.fontStyle === "Segoe UI 16pt") {
      style["font"] = "36px";
    } else {
      style["font"] = "40px Segoe UI";
    }

    ctx.font = style.font;
    ctx.fillStyle = style.color;
    ctx.fillText(`Name: ${userCreated.name}`, 10, 30);
    ctx.fillText(`Email: ${userCreated.email}`, 10, 60);

  }, [style, userCreated])

  useEffect(() => {
    instanceCoreApi.get(`${API}/${type}/${id}`).then((res) => {
      setItem(res.data.data);
    }).catch((error) => {
      Notify.Notify.failure(`Error fetching data data: ${error}`);
      console.log(error)
      setItem();
    })
  }, []);

  useEffect(() => {
    const handleConnect = (e) => {
      Notify.Notify.info("A new device is connected!");
      setPort(e.port);
    }

    const handleDisconnect = (e) => {
      Notify.Notify.info("A device is disconnected!");
      if (port && e.port === port) {
        setPort(null);
      }
    }
    navigator.serial.addEventListener("connect", handleConnect);

    navigator.serial.addEventListener("disconnect", handleDisconnect);

    return () => {
      navigator.serial.removeEventListener("connect", handleConnect);
      navigator.serial.removeEventListener("disconnect", handleDisconnect);
    };
  }, [port]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(itemUpdated);
    instanceCoreApi.put(`${API}/${type}/${id}`, itemUpdated).then(async (response) => {
      console.log(response.data);
      Notify.Notify.success(`Device info updated successfully!`);
      if (port) {
        const writer = port.writable.getWriter();
        for (const [key, value] of Object.entries(response.data.data)) {
          if (key !== "_v" && key !== "createdBy" && key !== "name" && key !== "active") {
            const keyValue = `${key}:${value}\n`;
            console.log(keyValue);
            const data = new TextEncoder().encode(keyValue);
            await writer.write(data);
          }
        }
        writer.releaseLock();
        Notify.Notify.success(`Write info to device successfully!`);
      }
    }).catch(error => {
      console.error(error);
      setSubmitted(false);
      Notify.Notify.failure(`Error updating new device info: ${error}`);
    })
  };

  const connectESP = async () => {
    if ("serial" in navigator) {
      try {
        const newPort = await navigator.serial.requestPort();
        await newPort.open({ baudRate: 115200 });
        setPort(newPort);
        Notify.Notify.success(`Opening serial port successfully! ${newPort.getInfo().usbVendorId}:${newPort.getInfo().usbProductId}`);
      } catch (error) {
        Notify.Notify.failure(`Error opening serial port: ${error}`);
      }
    } else {
      Notify.Notify.failure(`Sorry, this browser doesn't support webSerial`);
    }
  }

  if (type === "devices") {
    return (
      <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="heading-lg">{item.name}</h1>
        </div>
        {item.active || (!item.active && port) ? (
          <form className="form flex flex-col" onSubmit={handleSubmit}>
            <label className="dark:text-dark-text text-light-text">Fill your device information to continue</label>
            <Input
              className="input"
              required
              label="A pretty name"
              type="text"
              initialValue={item.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <Input
              className="input"
              label="Network SSID"
              required
              initialValue={item.ssid}
              type="text"
              onChange={(e) => handleChange("ssid", e.target.value)}
            />

            <Input.Password
              className="input"
              label="Network password"
              initialValue={item.pass}
              required
              onChange={(e) => handleChange("pass", e.target.value)}
            />

            <button>
              Submit
            </button>
          </form>
        ) : (
          <>
            <p>
              To start, please plug your ESP device to this machine via USB port.
              <br />
              When the device is connected, choose device below and continue.
            </p>
            <br />
            <button className="ok" onClick={connectESP}>
              Choose a device
            </button>
          </>
        )
        }
      </div>
    )
  } else {
    return (
      <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="heading-lg">Edit User</h1>
        </div>
        {userStage === 0 ? (
          <form className="form" onSubmit={handleStage}>
            <label className="dark:text-dark-text text-light-text">First, fill in your information to continue</label>
            <Input
              className="input"
              required
              label="Name"
              type="text"
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <Input
              className="input"
              label="Email"
              required
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              className="input"
              label="Address"
              required
              type="text"
              onChange={(e) => handleChange("address", e.target.value)}
            />

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
                onChange={(e) => handleChange("active", e.target.checked)}
              />
            </div>

            {userCreated.active ? (
              <div>
                <label style={{
                  fontSize: "14px",
                }}
                >
                  Active start time
                </label>
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
            ) : (
              <></>
            )}

            {userCreated.active ? (
              <button type="button" onClick={handleStage}>
                Continue
              </button>
            ) : (
              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </form>
        ) : (
          <>
            <canvas className="render-canvas" ref={canvaRef} width="340" height="150" />
            <form className="form" onSubmit={handleSubmit}>
              <label className="dark:text-dark-text text-light-text">Choose a device, and theme to display. Example view will be displayed above.</label>
              <Dropdown>
                <Dropdown.Button flat className="devices-choices">
                  {(userCreated.deviceID !== "") ? userCreated.deviceID : 'Choose a device'}
                </Dropdown.Button>
                <Dropdown.Menu
                  aria-label="Single selection actions"
                  color="primary"
                  items={devices}
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={userCreated.deviceID}
                >
                  {devices?.map((device) => {
                    return <Dropdown.Item key={device._id}>
                      <button
                        onClick={(e) => handleChange("deviceID", device._id)}
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
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Button flat className="devices-choices">
                  {(userCreated.fontStyle !== "") ? userCreated.fontStyle : 'Choose a font'}
                </Dropdown.Button>
                <Dropdown.Menu
                  aria-label="Single selection actions"
                  color="primary"
                  items={fonts}
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={userCreated.fontStyle}
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
                  {(userCreated.designSchema !== "") ? userCreated.designSchema : 'Choose a theme'}
                </Dropdown.Button>
                <Dropdown.Menu
                  aria-label="Single selection actions"
                  color="primary"
                  items={themes}
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={userCreated.designSchema}
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


              {console.log(`Name: `, userCreated.name)}
              {console.log(`Email: `, userCreated.email)}
              {console.log(`Address: `, userCreated.address)}
              {console.log(`Write on EPD?: `, userCreated.active)}
              {console.log(`Device: `, userCreated.deviceID)}
              {console.log(`Font: `, userCreated.fontStyle)}
              {console.log(`Theme: `, userCreated.designSchema)}

              <button type="submit">Submit</button>
              <button onClick={handleReset}>Back</button>
            </form>
          </>
        )}
      </div>
    )
  }
}

export default EditModal
