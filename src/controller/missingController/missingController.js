


const MissingChild = require("../../models/missing");
const Police = require("../../models/police");     // ✅ Police model
const { Expo } = require("expo-server-sdk");       // ✅ Expo SDK

const expo = new Expo();

const missingChildController = {

  // ==========================
  // ✅ Create Missing Child Report + Send Push Alerts
  // ==========================
  // ==========================
// ✅ Create Missing Child Report + Send Push Alerts
// ==========================
createMissingReport: async (req, res) => {
  try {
    const {
      childName,
      age,
      gender,
      photo,
      dressDescription,
      lastSeenLocation,
      dateMissing,
      missingTime,       // ✅ Added here
      parentName,
      parentPhone,
      language,
      fromWhere,
    } = req.body;

    if (!missingTime) {
      return res.status(400).json({ message: "missingTime is required" });
    }

    // Create new report
    const newReport = new MissingChild({
      childName,
      age,
      gender,
      photo,
      language,
      dressDescription,
      lastSeenLocation,
      dateMissing,
      missingTime,       // ✅ Added here
      fromWhere,
      parentName,
      parentPhone,
      reportedAtPolice: req.user._id,
    });

    await newReport.save();

    console.log(newReport);

    // Notify all police with push tokens
    const allPolice = await Police.find({ expoPushToken: { $exists: true } });

    const messages = allPolice.map((p) => (
      console.log(p),
      {
        to: p.expoPushToken,
        sound: "alarme-401847.wav",
        title: "New Missing Report",
        body: `A report for ${childName} (${gender}, ${age}) was submitted.`,
        data: { reportId: newReport._id },
      }
    ));

    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (err) {
        console.error("Push error:", err);
      }
    }

    // Response
    res.status(201).json({
      message: "Missing report created & alerts sent successfully",
      report: newReport,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating report", error: error.message });
  }
},


  // ==========================
  // ✅ Get all missing reports
  // ==========================
  getAllMissingReports: async (req, res) => {
  try {
    // Get all reports
    const reports = await MissingChild.find()
      .populate("reportedAtPolice", "name stationName phone")
      .sort({ createdAt: -1 });

    // Count total missing reports
    const count = await MissingChild.countDocuments();

    res.status(200).json({ count, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},


  // ==========================
  // ✅ Get report by ID
  // ==========================
  getMissingReportById: async (req, res) => {
    try {
      const { id } = req.params;

      const report = await MissingChild.findById(id)
        .populate("reportedAtStation", "name stationName phone");

      if (!report) {
        return res.status(404).json({ message: "Missing child report not found" });
      }

      res.status(200).json({ report });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ==========================
  // ✅ Update report status
  // ==========================
  updateReportStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const updated = await MissingChild.findByIdAndUpdate(
        id,
        { status: "Found" },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.status(200).json({
        message: "Report updated to Found",
        report: updated,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = missingChildController;
