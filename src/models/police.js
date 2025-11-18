
const mongoose = require("mongoose");

const policeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  policeId: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate IDs
  },
  stationName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // store the image URL or file path
    required:true
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"], // only allow these two values
    default: "Active", // default is active
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
    required: true,
  },
  expoPushToken: {
    type: String,
    default: null, // store Expo push token for notifications
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("police", policeSchema);
