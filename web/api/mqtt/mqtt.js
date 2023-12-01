const mqtt = require("mqtt");
require('dotenv').config();
const DeviceModel = require("../models/Device");

const BROKER = process.env.BROKER;
const USER = process.env.USER;
const PASS = process.env.PASS;

exports.connect = () => {
    const client = mqtt.connect(BROKER, {
        username: USER,
        password: PASS
    })
    return client;
};

// exports.getAllDevicesStatuses = async (client, accountId) => {
//     const devices = await DeviceModel.find({
//         createdBy: accountId
//     })
//     client.on('connect', () => {
//       console.log("Connected to MQTT Broker!");
//         devices.map((device) => {
//             device = device.toObject();
//             client.subscribe(device._id, { qos: 0 }, (err) => {
//                 if (err) {
//                   console.log(`Error subscribing to topic ${device._id}`);
//                 } else {
//                   console.log(`Subscribed to topic ${device._id} successfully!`);
//                 }
//               });
//             client.publish(device._id, "ping");

//             client.on('message', async(topic, message))
//         })
//     })
// }


exports.writeDevice = async (client, device, user) => {
client.on("conect", () => {
    console.log("Connected to MQTT Broker!");
    client.publish(device._id, user.fontStyle);
    client.publish(device._id, user.designSchema);
    client.publish(device._id, user.name);
    client.publish(device._id, user.email);
    client.publish(device._id, user.address);
    client.publish(device._id, user._id);
    client.subscribe(device._id, { qos: 0 }, (err) => {
        if (err) {
          console.log(`Error subscribing to topic ${device._id}`);
        } else {
          console.log(`Subscribed to topic ${device._id} successfully!`);
        }
      });
});

client.on("message", async (topic, message) => {
    const data = message.toString();
    const regex = /^writeOK\|(.+)$/;
    const match = data.match(regex);
    if (match && topic === device._id) {
      const oldUserID = match[1];
      if (oldUserID !== "") {
          const oldUser = await UserModel.findById(oldUserID);
          oldUser["active"] = false;
          oldUser["deviceID"] = "";
          const now = Math.floor(new Date().getTime() / 1000);
          oldUser["activeTimestamp"].push(`${oldUser["activeStartTime"]}-${now}`)
          oldUser["activeStartTime"] = -1;
          await UserModel.findByIdAndUpdate(oldUserID, oldUser);
      }
    }
  })
}