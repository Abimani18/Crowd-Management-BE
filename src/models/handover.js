const mongoose = require("mongoose");

const CaseCloseSchema = new mongoose.Schema(
  {
   

    reporterName: { type: String, required: true },
    reporterPhone: { type: String, required: true },
    reporterImage: { type: String, required: false },
    foundchildID: { type: String, required: false },
    missingreportID: { type: String, required: false },
    status: {
      type: String,
      enum: ["Pending", "Handover"],
      default: "Handover",
    },
    handoverByPoliceID: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CaseClose", CaseCloseSchema);
