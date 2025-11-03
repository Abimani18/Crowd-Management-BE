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
   roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("police", policeSchema);
