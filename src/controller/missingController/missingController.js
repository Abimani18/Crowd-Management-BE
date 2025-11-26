


const MissingChild = require("../../models/missing");
const Police = require("../../models/police");     // ✅ Police model
const { Expo } = require("expo-server-sdk");       // ✅ Expo SDK

const expo = new Expo();

const multer = require("multer");
const path = require("path");


const missingChildController = {

  // ==========================
  // ✅ Create Missing Child Report + Send Push Alerts
  // ==========================
  createMissingReport: async (req, res) => {

    // Multer uploaded files
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least one photo is required" });
    }

    // Convert each uploaded file to public URL
    const photoUrls = files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });

    try {
      const {
        childName,
        age,
        gender,
        dressDescription,
        lastSeenLocation,
        dateMissing,
        reporterName,
        reporterPhone,
        language,
        fromWhere,
      } = req.body;

      console.log(language)
      // Create new report
      const newReport = new MissingChild({
        childName,
        age,
        gender,
        photo: photoUrls,  
        language,
        dressDescription,
        lastSeenLocation,
        dateMissing,
        fromWhere,
        reporterName,
        reporterPhone,
        reportedAtPolice: req.user._id 
      });

 

    await newReport.save();

    console.log(newReport);

    
    const allPolice = await Police.find();

    // Get only police with valid Expo tokens
const validPolice = allPolice.filter(
  p => p.expoPushToken && Expo.isExpoPushToken(p.expoPushToken)
);

const messages = validPolice.map(p => ({
  to: p.expoPushToken,
  sound: "default",
  title: "New Missing Report",
  body: `A report for ${childName} (${gender}, ${age}) was submitted.`,
  data: { reportId: newReport._id },
}));

// Chunk + Send
const chunks = expo.chunkPushNotifications(messages);

for (const chunk of chunks) {
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
