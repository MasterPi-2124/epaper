const mqtt = require("mqtt");
const fs = require('fs');
const DeviceModel = require("../models/Device");
const DataModel = require("../models/Data");

require('dotenv').config();
const BROKER = process.env.BROKER;
const USER = process.env.USER;
const PASS = process.env.PASS;
let client = null;
const responseTimeout = 6000;
let globalMessageHandlers = new Map();
const ca = fs.readFileSync(`/etc/ssl/mongoKey/ca.crt`);
const cert = fs.readFileSync(`/etc/ssl/mongoKey/backend.crt`);
const key = fs.readFileSync(`/etc/ssl/mongoKey/backend.key`);

const writeDeviceHandler = (data) => {
  return async (topic, oldDataID) => {
    if (topic === data.deviceID) {
      console.log(`Received writeOK response from ${topic}`);
      const device = await DeviceModel.findById(data.deviceID);
      console.log(oldDataID, data._id);
      const now = Math.floor(new Date().getTime() / 1000);

      if (oldDataID !== "" && oldDataID !== `${data._id}`) {
        const oldData = await DataModel.findById(oldDataID);

        if (oldData) {
          oldData["active"] = false;
          oldData["deviceID"] = "";
          oldData["deviceName"] = "";
          oldData["activeTimestamp"].push(`${oldData["activeStartTime"]}-${now}`)
          oldData["activeStartTime"] = -1;
          await DataModel.findByIdAndUpdate(oldDataID, oldData);
        }
      }
      data["activeStartTime"] = `${now}`;
      await DataModel.findByIdAndUpdate(`${data._id}`, data);

      device["active"] = true;
      device["dataID"] = `${data._id}`;
      device["dataName"] = `${data.name}`;
      await DeviceModel.findByIdAndUpdate(data.deviceID, device);
    }
  }
}

const getStatusHandler = (topics, deviceTimeouts, updateStatus) => {
  return async (topic) => {
    if (topics.includes(topic)) {
      console.log(`Received ping response from ${topic}`);
      if (deviceTimeouts.has(topic)) {
        clearTimeout(deviceTimeouts.get(topic));
        deviceTimeouts.delete(topic);
      }
      updateStatus(topic, true);
      // this.unsubscribe(topic);
    }
  }
}

const removeHandler = (id) => {
  return async (topic) => {
    if (topic === id) {
      console.log(`Received removeOK response from ${topic}`);
      const device = await DeviceModel.findById(id);
      device["dataID"] = "";
      device["dataName"] = "";
      await DeviceModel.findByIdAndUpdate(id, device);
    }
  }
}

const otaHandler = (id) => {
  return async (topic) => {
    if (topic === id) {
      console.log(`Received otaOK response from ${topic}`);
    }
  }
}

exports.connect = () => {
  if (!client || !client.connected) {
    client = mqtt.connect(BROKER, {
      username: USER,
      password: PASS,
      clientId: "backend-client",
      ca: ca,
      cert: cert,
      key: key,
    })

    client.on("connect", async () => {
      console.log("Connected to MQTT Broker!");
      const devices = await DeviceModel.find();
      const deviceIds = devices.map(device => `${device._id}`);
      console.log(`Found existed devices: ${deviceIds}`);
      deviceIds.forEach(topic => this.subscribe(topic))
    })

    client.on('error', (err) => {
      console.error('MQTT Error:', err);
    });

    client.on("message", (topic, message) => {
      console.log(topic, message.toString());
      const data = message.toString();
      const regex = /^writeOK\|(.*)$/;
      const match = data.match(regex);
      if (data.startsWith("writeOK")) {
        if (globalMessageHandlers.has("writeOK")) {
          console.log("found writeOK, ", match)
          const handler = globalMessageHandlers.get("writeOK");
          handler(topic, match[1]);
        }
      } else if (data.startsWith("pingOK")) {
        if (globalMessageHandlers.has("pingOK")) {
          console.log("found pingOK, ")
          const handler = globalMessageHandlers.get("pingOK");
          handler(topic);
        }
      } else if (data.startsWith("removeOK")) {
        if (globalMessageHandlers.has("removeOK")) {
          console.log("found removeOK, ")
          const handler = globalMessageHandlers.get("removeOK");
          handler(topic);
        }
      }
    })
  }
};

exports.subscribe = (topic) => {
  client.subscribe(topic, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.log(`Error subscribing to topic ${topic}: ${error}`);
    } else {
      console.log(`Subscribed to topic ${topic} successfully!`);
    }
  })
}

exports.unsubscribe = (topic) => {
  client.unsubscribe(topic, (error) => {
    if (error) {
      console.log(`Error unsubscribing from topic ${topic}: ${error}`);
    } else {
      console.log(`Unsubscribed from topic ${topic} successfully!`);
    }
  })
}

exports.getAllDevicesStatuses = async (topics) => {
  const updateStatus = async (topic, status) => {
    let device = await DeviceModel.findById(topic);
    if (device) {
      device["active"] = status;
      await DeviceModel.findByIdAndUpdate(topic, device);
    }
  }

  return new Promise((resolve) => {
    const deviceTimeouts = new Map();

    const handler = getStatusHandler(topics, deviceTimeouts, updateStatus);
    globalMessageHandlers.set("pingOK", handler);

    topics.forEach(topic => {
      // this.subscribe(topic);
      client.publish(`${topic}`, "ping|");
      deviceTimeouts.set(topic, setTimeout(() => {
        console.log(`No response from device ${topic}, setting status to false`);
        updateStatus(topic, false); // Implement this function to update the device status in your storage
      }, responseTimeout));
    })

    setTimeout(() => {
      resolve();
      globalMessageHandlers.delete("pingOK");
    }, responseTimeout + 1000);
  })
}

exports.writeDevice = async (data) => {
  console.log("writing to device...");
  let payload = "";

  if (data.type === "Client") {
    payload = payload + "write1|";
  } else if (data.type === "Student") {
    payload = payload + "write2|";
  } else if (data.type === "Employee") {
    payload = payload + "write3|";
  } else if (data.type === "Product") {
    payload = payload + "write4|";
  } else if (data.type === "Room") {
    payload = payload + "write5|";
  }

  switch (data.fontStyle) {
    case "Monospace 12pt":
      payload = payload + "F12|";
      break;
    case "Monospace 16pt":
      payload = payload + "F16|";
      break;
    case "Monospace 20pt":
      payload = payload + "F20|";
      break;
    case "Segoe UI Light, 11pt":
      payload = payload + "s11|";
      break;
    case "Segoe UI Bold, 11pt":
      payload = payload + "S11|";
      break;
    case "Segoe UI Light, 16pt":
      payload = payload + "s16|";
      break;
    case "Segoe UI Bold, 16pt":
      payload = payload + "S16|";
      break;
    case "Segoe UI Light, 20pt":
      payload = payload + "s20|";
      break;
    default:
      payload = payload + "S16|";
  }

  switch (data.designSchema) {
    case "Theme 1":
      payload = payload + "1|";
      break;
    case "Theme 2":
      payload = payload + "2|";
      break;
    case "Theme 3":
      payload = payload + "3|";
      break;
    case "Theme 4":
      payload = payload + "4|";
      break;
    default:
      payload = payload + "1|";
  }

  payload = payload + `${data.name}|`;

  switch (data.type) {
    case "Client":
      payload = payload + `${data.email}|`;
      payload = payload + `${data.input2}|`;
      break;
    case "Student":
      payload = payload + `${data.email}|`;
      payload = payload + `${data.input2}|`;
      payload = payload + `${data.input3}|`;
      break;
    case "Employee":
      payload = payload + `${data.email}|`;
      payload = payload + `${data.input2}|`;
      payload = payload + `${data.input3}|`;
      break;
    case "Product":
      payload = payload + `${data.input2}|`;
      payload = payload + `${data.input3}|`;
      break;
    case "Room":
      payload = payload + `${data.input2}|`;
      payload = payload + `${data.input3}|`;
      payload = payload + `${data.input4}|`;
      break;

  }
  payload = payload + `${data._id}|`;
  console.log(payload);

  return new Promise((resolve) => {
    const handler = writeDeviceHandler(data);
    globalMessageHandlers.set("writeOK", handler);

    // this.subscribe(data.deviceID);
    client.publish(`${data.deviceID}`, payload, (err) => {
      if (err) {
        console.log(`Error publishing to topic ${data.deviceID}: ${err}`);
      } else {
        console.log(`Published to topic ${data.deviceID} successfully!`);
      }
    });

    setTimeout(() => {
      resolve();
      globalMessageHandlers.delete("writeOK");
    }, responseTimeout + 5000);
  })
}

exports.updateDevice = async (id, data) => {

  console.log("updating to device...");
  let payload = "update|";
  if (data.ssid) {  // update device data
    payload = payload + `${data.ssid}|`;
    payload = payload + `${data.pass}|`;
  } else {          // remove data info
    payload = payload + "removeData|";
  }

  console.log(payload);
  return new Promise((resolve) => {
    const handler = removeHandler(id);
    globalMessageHandlers.set("removeOK", handler);

    // this.subscribe(`${id}`);
    client.publish(`${id}`, payload, (err) => {
      if (err) {
        console.log(`Error publishing to topic ${id}: ${err}`);
      } else {
        console.log(`Published to topic ${id} successfully!`);
      }
    });

    setTimeout(() => {
      resolve();
      globalMessageHandlers.delete("removeOK");
    }, responseTimeout + 1000);
  })
}

exports.ota = async (id, firmware) => {
  console.log("sending ota request to device...");
  let payload = `ota|${firmware}|`;
  console.log(payload);

  client.publish(`${id}`, payload, (err) => {
    if (err) {
      console.log(`Error publishing to topic ${id}: ${err}`);
    } else {
      console.log(`Published to topic ${id} successfully!`);
    }
  });
}