const mongoose = require("mongoose");

const missingChildSchema = new mongoose.Schema({
  childName: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  photo: {
    type: [String], 
    required: true,
  },
  language:{
      type: String,
    required: true,
  },
  dressDescription: {
    type: String,
    required: true,
  },
  lastSeenLocation: {
    type: String,
    required: true,
  },
  dateMissing: {
    type: Date,
    required: true,
  },
   fromWhere: {
    type: String,
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  parentPhone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  reportedAtPolice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "police", // which police station took the report
    required: true,
  },
  handoverByPolice: {
    type:String,
    default: "Null",
  },
  status: {
    type: String,
    enum: ["Missing", "Found"],
    default: "Missing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MissingChildReport", missingChildSchema);

