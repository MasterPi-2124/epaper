const mqtt = require("mqtt");
const DeviceModel = require("../models/Device");
const UserModel = require("../models/User");

require('dotenv').config();
const BROKER = process.env.BROKER;
const USER = process.env.USER;
const PASS = process.env.PASS;
let client = null;
const responseTimeout = 5000;
let globalMessageHandlers = new Map();

const writeDeviceHandler = (user) => {
  return async (topic, oldUserID) => {
    if (topic === user.deviceID) {
      if (oldUserID !== user._id) {
        const oldUser = await UserModel.findById(oldUserID);
        const device = await DeviceModel.findById(user.deviceID);
        const now = Math.floor(new Date().getTime() / 1000);

        if (oldUser) {
          oldUser["active"] = false;
          oldUser["deviceID"] = "";
          oldUser["activeTimestamp"].push(`${oldUser["activeStartTime"]}-${now}`)
          oldUser["activeStartTime"] = -1;
          await UserModel.findByIdAndUpdate(oldUserID, oldUser);
        }

        user["activeStartTime"] = `${now}`;
        user["activeTimestamp"] = [];
        await UserModel.findByIdAndUpdate(user._id, user);

        device["active"] = true;
        device["userID"] = user._id;
        await DeviceModel.findByIdAndUpdate(user.deviceID, device);
      }
      this.unsubscribe(topic);
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
      this.unsubscribe(topic);
    }
  }
}

const removeHandler = (id) => {
  return async (topic) => {
    if (topic === id) {
      const device = await DeviceModel.findById(id);
      device["userID"] = "";
      await DeviceModel.findByIdAndUpdate(id, device);
      this.unsubscribe(topic);
    }
  }
}

exports.connect = () => {
  if (!client || !client.connected) {
    console.log("client not connected")
    client = mqtt.connect(BROKER, {
      username: USER,
      password: PASS,
      clientId: "backend-client"
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
      const regex = /^writeOK\|(.+)$/;
      const regex2 = /^removeOK\|(.+)$/;
      const match = data.match(regex);
      const match2 = data.match(regex2);
      if (data.startsWith("writeOK")) {
        if (globalMessageHandlers.has("writeOK")) {
          const handler = globalMessageHandlers.get("writeOK");
          handler(topic, match[1]);
        }
      } else if (data.startsWith("pingOK")) {
        if (globalMessageHandlers.has("pingOK")) {
          const handler = globalMessageHandlers.get("pingOK");
          handler(topic);
        }
      } else if (data.startsWith("removeOK")) {
        const handler = globalMessageHandlers.get("removeOK");
        handler(topic);
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
    device["active"] = status;
    await DeviceModel.findByIdAndUpdate(topic, device);
  }

  return new Promise((resolve) => {
    const deviceTimeouts = new Map();

    const handler = getStatusHandler(topics, deviceTimeouts, updateStatus);
    globalMessageHandlers.set("pingOK", handler);

    topics.forEach(topic => {
      this.subscribe(topic);
      client.publish(`${topic}`, "ping|");
      deviceTimeouts.set(topic, setTimeout(() => {
        console.log(`No response from device ${topic}, setting status to false`);
        updateStatus(topic, false); // Implement this function to update the device status in your storage
        this.unsubscribe(topic);
      }, responseTimeout));
    })

    setTimeout(() => {
      resolve();
      globalMessageHandlers.delete("pingOK");
    }, responseTimeout + 1000);
  })
}

exports.writeDevice = async (user) => {
  console.log("writing to device...");
  let payload = "";

  if (user.type === "Client") {
    payload = payload + "write1|";
  } else if (user.type === "Student") {
    payload = payload + "write2|";
  } else if (user.type === "Employee") {
    payload = payload + "write3|";
  } else if (user.type === "Product") {
    payload = payload + "write4|";
  } else if (user.type === "Room") {
    payload = payload + "write5|";
  }

  switch (user.fontStyle) {
    case "Monospace 8pt":
      payload = payload + "F8|";
      break;
    case "Monospace 12pt":
      payload = payload + "F12|";
      break;
    case "Monospace 16pt":
      payload = payload + "F16|";
      break;
    case "Monospace 24pt":
      payload = payload + "F20|";
      break;
    case "Segoe UI 8pt":
      payload = payload + "F24|";
      break;
    case "Segoe UI 12pt":
      payload = payload + "S12|";
      break;
    case "Segoe UI 16pt":
      payload = payload + "S16|";
      break;
    case "Segoe UI 20pt":
      payload = payload + "S20|";
      break;
    default:
      payload = payload + "Segoe12|";
  }

  switch (user.designSchema) {
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

  payload = payload + `${user.name}|`;

  switch (user.type) {
    case "Client":
      payload = payload + `${user.email}|`;
      payload = payload + `${user.input2}|`;
      break;
    case "Student":
      payload = payload + `${user.email}|`;
      payload = payload + `${user.input2}|`;
      payload = payload + `${user.input3}|`;
      break;
    case "Employee":
      payload = payload + `${user.email}|`;
      payload = payload + `${user.input2}|`;
      payload = payload + `${user.input3}|`;
      break;
    case "Product":
      payload = payload + `${user.input2}|`;
      payload = payload + `${user.input3}|`;
      break;
    case "Room":
      payload = payload + `${user.input2}|`;
      payload = payload + `${user.input3}|`;
      payload = payload + `${user.input4}|`;
      break;

  }
  payload = payload + `${user._id}|`;

  console.log(payload);

  this.subscribe(user.deviceID);
  const handler = writeDeviceHandler(user);
  globalMessageHandlers.set("writeOK", handler);

  client.publish(`${user.deviceID}`, payload, (err) => {
    if (err) {
      console.log(`Error publishing to topic ${user.deviceID}: ${err}`);
    } else {
      console.log(`Published to topic ${user.deviceID} successfully!`);
    }
  });

  setTimeout(() => {
    globalMessageHandlers.delete("writeOK");
  }, responseTimeout + 1000);
}

exports.updateDevice = async (id, data) => {

  console.log("updating to device...");
  let payload = "update|";
  if (data.ssid) {  // update device data
    payload = payload + `${data.ssid}|`;
    payload = payload + `${data.pass}|`;
    // payload = payload + `${data.userID}|`;
  } else {          // update user data
    payload = payload + "removeUser|";
  }

  console.log(payload);
  this.subscribe(`${id}`);
  const handler = removeHandler(id);
  globalMessageHandlers.set("removeOK", handler);

  client.publish(`${id}`, payload, (err) => {
    if (err) {
      console.log(`Error publishing to topic ${id}: ${err}`);
    } else {
      console.log(`Published to topic ${id} successfully!`);
    }
  });

  setTimeout(() => {
    globalMessageHandlers.delete("removeOK");
  }, responseTimeout + 1000);
}