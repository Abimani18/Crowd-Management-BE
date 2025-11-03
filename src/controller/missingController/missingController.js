const MissingChild = require("../../models/missing");

const missingChildController = {
  // ✅ Create a Missing Child Report
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
        parentName,
        parentPhone,
      } = req.body;

      // Validation
      if (
        !age ||
        !gender ||
        !photo ||
        !dressDescription ||
        !lastSeenLocation ||
        !dateMissing ||
        !parentName ||
        !parentPhone
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Create new report
      const newReport = await MissingChild.create({
        childName,
        age,
        gender,
        photo,
        dressDescription,
        lastSeenLocation,
        dateMissing,
        parentName,
        parentPhone,
        reportedAtStation: req.user._id, // logged-in police user
      });

      res.status(201).json({
        message: "Missing child report created successfully",
        report: newReport,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get all missing child reports
  getAllMissingReports: async (req, res) => {
    try {
      const reports = await MissingChild.find()
        .populate("reportedAtStation", "name stationName phone")
        .sort({ createdAt: -1 });

      res.status(200).json({ reports });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get a particular missing child report by ID
getMissingReportById: async (req, res) => {
  try {
    const { id } = req.params;

    // Find the report and populate the police station info
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


  // ✅ Update report status to "Found" (after match)
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
