import React, { useEffect } from "react";
import { Notify } from "notiflix";
import { Input } from "@nextui-org/react";

const Device = ({ deviceUpdated, handleSubmit, handleChange, port, setPort }) => {
  useEffect(() => {
    const handleConnect = (e) => {
      Notify.info("A new device is connected!");
      setPort(e.port);
    }

    const handleDisconnect = (e) => {
      Notify.info("A device is disconnected!");
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

  const connectESP = async () => {
    if ("serial" in navigator) {
      try {
        const newPort = await navigator.serial.requestPort();
        await newPort.open({ baudRate: 115200 });
        setPort(newPort);
        Notify.success(`Opening serial port successfully! ${newPort.getInfo().usbVendorId}:${newPort.getInfo().usbProductId}`);
      } catch (error) {
        Notify.failure(`Error opening serial port: ${error}`);
      }
    } else {
      Notify.failure(`Sorry, this browser doesn't support webSerial`);
    }
  }

  return (
    (deviceUpdated.active || (!deviceUpdated.active && port) ? (
      // {(port) ? (
      <form className="form flex flex-col" onSubmit={handleSubmit}>
        <label className="dark:text-dark-text text-light-text">Fill your device information to continue</label>
        <Input
          className="input"
          required
          label="A pretty name"
          type="text"
          initialValue={deviceUpdated.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <Input
          className="input"
          label="Network SSID"
          required
          initialValue={deviceUpdated.ssid}
          type="text"
          onChange={(e) => handleChange("ssid", e.target.value)}
        />

        <Input.Password
          className="input"
          label="Network password"
          initialValue={deviceUpdated.pass}
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
    ))
  )
}

export default Device;
