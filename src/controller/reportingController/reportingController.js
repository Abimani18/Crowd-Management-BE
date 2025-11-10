const FoundChildReport = require("../../models/report");
const MissingChild = require("../../models/missing");

const foundChildController = {
  // ✅ Police reports a found child
  createFoundReport: async (req, res) => {
    try {
      const {
        childName,
        childPhoto,
        estimatedAge,
        gender,
        dressDescription,
        foundLocation,
        description,
      } = req.body;

      if (!childPhoto || !foundLocation) {
        return res.status(400).json({
          message: "childPhoto and foundLocation are required",
        });
      }

      const newFound = await FoundChildReport.create({
        foundBy: req.user._id, // police user
        childName,
        childPhoto,
        estimatedAge,
        gender,
        dressDescription,
        foundLocation,
        description,
      });

      res.status(201).json({
        message: "Found child report created successfully",
        report: newFound,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get all found child reports
  getAllFoundReports: async (req, res) => {
    try {
      const reports = await FoundChildReport.find()
        .populate("foundBy", "name stationName phone")
        .populate("matchedMissingReport", "childName parentName parentPhone")
        .sort({ createdAt: -1 });

      res.status(200).json({ reports });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get a particular found child report by ID
getFoundReportById: async (req, res) => {
  try {
    const { id } = req.params;

    // Find the found report and populate related data
    const report = await FoundChildReport.findById(id)
      .populate("foundBy", "name stationName phone")
      .populate("matchedMissingReport", "childName parentName parentPhone");

    if (!report) {
      return res.status(404).json({ message: "Found child report not found" });
    }

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

  // ✅ Link found child to missing report (manual match)
  matchWithMissingReport: async (req, res) => {
    try {
      const { foundId, missingId } = req.body;

      const found = await FoundChildReport.findById(foundId);
      const missing = await MissingChild.findById(missingId);

      if (!found || !missing) {
        return res.status(404).json({ message: "Invalid IDs provided" });
      }

      found.matchedMissingReport = missingId;
      found.status = "Identified";
      await found.save();

      missing.status = "Found";
      await missing.save();

      res.status(200).json({
        message: "Match successful",
        found,
        missing,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = foundChildController;
