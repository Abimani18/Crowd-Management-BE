const mongoose = require("mongoose");

const foundChildReportSchema = new mongoose.Schema({
  foundBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "police",
    required: true,
  },
  childName:{
    type: String,
  },
  childPhoto: {
    type: String,
    required: true,
  },
  estimatedAge: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  dressDescription: {
    type: String,
  },
  foundLocation: {
    type: String,
    required: true,
  },
  foundDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  // Optional: link to parent report if matched
  matchedMissingReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MissingChildReport",
  },
  status: {
    type: String,
    enum: ["Unidentified", "Identified"],
    default: "Unidentified",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FoundChildReport", foundChildReportSchema);
