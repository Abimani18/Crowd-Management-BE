
const mongoose = require("mongoose");

const foundChildReportSchema = new mongoose.Schema({
  foundBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "police",
    required: true,
  },
  childName: {
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
  fromWhere: {
    type: String,
  },
   language:{
      type: String,
  },
  dressDescription: {
    type: String,
  },
  foundLocation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  matchedMissingReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MissingChildReport",
  },
  // ✅ store the date/time when the child was reported missing
  missingDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Missing", "Found", "Handover"],
    default: "Found",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // ✅ Automatically record found date/time
  foundAt: {
    type: Date,
    default: Date.now,
  },
  reporterPhoto: { type: String },
  handoverByPolice: {
    type:String,
    default: "Null",
  },
});

// ✅ Prevent OverwriteModelError
module.exports =
  mongoose.models.FoundChildReport ||
  mongoose.model("FoundChildReport", foundChildReportSchema);
