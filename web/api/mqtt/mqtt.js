const mqtt = require("mqtt");
require('dotenv').config();
const DeviceModel = require("../models/Device");
const UserModel = require("../models/User");
const DeviceService = require("../services/DeviceService");

const BROKER = process.env.BROKER;
const USER = process.env.USER;
const PASS = process.env.PASS;

exports.connect = () => {
  const client = mqtt.connect(BROKER, {
    username: USER,
    password: PASS,
    clientId: "backend-client"
  })

  return client;
};

// exports.getAllDevicesStatuses = async (client, accountId) => {
//   console.log(accountId);
//   let updates = 0;
//   const devices = await DeviceModel.find({
//     createdBy: accountId
//   })
//   console.log(devices);

//   client.on('connect', () => {
//     console.log("Connected to MQTT Broker!");
//     for (const device of devices) {
//       client.subscribe(`${device._id}`, { qos: 0 }, (err) => {
//         if (err) {
//           console.log(`Error subscribing to topic ${device._id}`);
//         } else {
//           console.log(`Subscribed to topic ${device._id} successfully!`);
//           client.publish(`${device._id}`, "ping|", (err) => {
//             if (err) {
//               console.log(`Error publishing to topic ${device._id}: ${err}`);
//             } else {
//               console.log(`Published to topic ${device._id} successfully!`);
//             }
//           });
//         }
//       });
//     }
//   });

//   client.on("message", async (topic, message) => {
//     console.log(topic, message.toString());
//     const data = message.toString();
//     const regex = /^pingOK\|(.+)$/;
//     const match = data.match(regex);
//     if (match) {
//       let device = await DeviceModel.findById(topic);
//       if (device) {
//         device["active"] = true;
//         await DeviceModel.findByIdAndUpdate(device._id, device);
//         updates++;
//         if (updates == devices.length) {
//           client.end();
//         }
//       }
//     }
//   })

//   client.on('error', (err) => {
//     console.error('MQTT Error:', err);
//   });

//   // Handle disconnect event
//   client.on('close', () => {
//     console.log('Disconnected from MQTT broker');
//   });
// }


exports.writeDevice = async (client, user) => {
  console.log("writing to device...");
  client.on("connect", () => {
    console.log("Connected to MQTT Broker!");
    client.subscribe(`${user.deviceID}`, { qos: 0 }, (err) => {
      if (err) {
        console.log(`Error subscribing to topic ${user.deviceID}: ${err}`);
      } else {
        console.log(`Subscribed to topic ${user.deviceID} successfully!`);
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
        client.publish(`${user.deviceID}`, payload, (err) => {
          if (err) {
            console.log(`Error publishing to topic ${user.deviceID}: ${err}`);
          } else {
            console.log(`Published to topic ${user.deviceID} successfully!`);
          }
        });
      }
    });

    setTimeout(() => {
      client.end();
    }, 10000);
  });

  client.on("message", async (topic, message) => {
    console.log(topic, message.toString());
    const data = message.toString();
    const regex = /^replyOK\|(.+)$/;
    const match = data.match(regex);
    if (match && topic === user.deviceID) {
      const oldUserID = match[1];
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

      client.end();
    }
  });

  client.on('error', (err) => {
    console.error('MQTT Error:', err);
  });

  client.on('close', () => {
    console.log('Disconnected from MQTT broker');
  });
}