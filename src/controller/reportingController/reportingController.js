const FoundChildReport = require("../../models/report");
const MissingChild = require("../../models/missing");
const Police = require("../../models/police");

const foundChildController = {

  // ======================================
  // ✅ CREATE FOUND CHILD REPORT
  // ======================================
  createFoundReport: async (req, res) => {
    try {
      const {
        childName,
        estimatedAge,
        gender,
        fromWhere,
        language,
        dressDescription,
        foundLocation,
        description,
        foundAt, // Manual input like "20-3-2025, 11.10"
      } = req.body;

      if (!req.file || !foundLocation) {
        return res.status(400).json({
          message: "childPhoto (file) and foundLocation are required",
        });
      }

      const childPhotoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      // Parse manual date
      let foundDate;
      if (foundAt) {
        const cleaned = foundAt.replace(",", "").replace(".", ":");
        const [datePart, timePart] = cleaned.split(" ");
        const [day, month, year] = datePart.split(/[-/]/);
        const formattedString =
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart || "00:00"}`;
        foundDate = new Date(formattedString);
      } else {
        foundDate = new Date();
      }

      const newFound = await FoundChildReport.create({
        foundBy: req.user._id,
        childName,
        childPhoto: childPhotoUrl,
        language,
        estimatedAge,
        gender,
        fromWhere,
        dressDescription,
        foundLocation,
        description,
        foundAt: foundDate,
      });

      const populated = await FoundChildReport.findById(newFound._id)
        .populate("foundBy", "name policeId stationName phone");

      res.status(201).json({
        message: "Found child report created successfully",
        report: populated,
      });

    } catch (error) {
      console.error("Found Report Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ======================================
  // ✅ GET ALL FOUND REPORTS
  // ======================================
  getAllFoundReports: async (req, res) => {
    try {
      const reports = await FoundChildReport.find()
        .populate("foundBy", "name policeId stationName phone")
        .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation status")
        .sort({ createdAt: -1 });

      const formatted = reports.map((r) => ({
        _id: r._id,
        childName: r.childName,
        gender: r.gender,
        estimatedAge: r.estimatedAge,
        childPhoto: r.childPhoto,
        foundLocation: r.foundLocation,
        dressDescription: r.dressDescription,
        description: r.description,
        foundAt: r.foundAt,
        status: r.status,
        createdAt: new Date(r.createdAt).toLocaleString("en-IN"),

        policeOfficer: {
          name: r.foundBy?.name,
          policeId: r.foundBy?.policeId,
          stationName: r.foundBy?.stationName,
          phone: r.foundBy?.phone,
        },

        matchedMissingReport: r.matchedMissingReport
          ? {
              childName: r.matchedMissingReport.childName,
              parentName: r.matchedMissingReport.parentName,
              parentPhone: r.matchedMissingReport.parentPhone,
              lastSeenLocation: r.matchedMissingReport.lastSeenLocation,
              dateMissing: new Date(r.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
              status: r.matchedMissingReport.status,
            }
          : null,
      }));

      res.status(200).json({
        message: "All found child reports fetched successfully",
        count: formatted.length,
        reports: formatted,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ======================================
  // ✅ GET REPORT BY ID
  // ======================================
  getFoundReportById: async (req, res) => {
    try {
      const { id } = req.params;

      const r = await FoundChildReport.findById(id)
        .populate("foundBy", "name policeId stationName phone")
        .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation status");

      if (!r) {
        return res.status(404).json({ message: "Found child report not found" });
      }

      res.status(200).json({
        _id: r._id,
        childName: r.childName,
        gender: r.gender,
        estimatedAge: r.estimatedAge,
        foundLocation: r.foundLocation,
        dressDescription: r.dressDescription,
        description: r.description,
        foundAt: r.foundAt,
        status: r.status,
        createdAt: new Date(r.createdAt).toLocaleString("en-IN"),

        policeOfficer: {
          name: r.foundBy?.name,
          policeId: r.foundBy?.policeId,
          stationName: r.foundBy?.stationName,
          phone: r.foundBy?.phone,
        },

        matchedMissingReport: r.matchedMissingReport
          ? {
              childName: r.matchedMissingReport.childName,
              parentName: r.matchedMissingReport.parentName,
              parentPhone: r.matchedMissingReport.parentPhone,
              lastSeenLocation: r.matchedMissingReport.lastSeenLocation,
              dateMissing: new Date(r.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
              status: r.matchedMissingReport.status,
            }
          : null,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ======================================
  // ✅ MANUAL MATCH FOUND ↔ MISSING
  // ======================================
  matchWithMissingReport: async (req, res) => {
    try {
      const { foundId, missingId } = req.body;

      const found = await FoundChildReport.findById(foundId);
      const missing = await MissingChild.findById(missingId);

      if (!found || !missing) {
        return res.status(404).json({ message: "Invalid IDs provided" });
      }

      await FoundChildReport.updateOne(
        { _id: foundId },
        {
          matchedMissingReport: missingId,
          missingDate: missing.dateMissing,
          status: "Found",
        }
      );

      await MissingChild.updateOne(
        { _id: missingId },
        { status: "Found", foundAt: new Date() }
      );

      const populated = await FoundChildReport.findById(foundId)
        .populate("foundBy", "name policeId stationName phone")
        .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation");

      res.status(200).json({
        message: "Match successful",
        found: populated,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ======================================
  // ✅ CASE CLOSE + HANDOVER
  // ======================================
  caseClose: async (req, res) => {
    try {
      const { policeId, reporterName, finderId } = req.body;
      const reportId = req.params.id;

      const reporterImage = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;

      if (!policeId) {
        return res.status(400).json({ message: "policeId is required" });
      }
      if (!reportId) {
        return res.status(400).json({ message: "missing reportId" });
      }
      if (!reporterName && !finderId) {
        return res.status(400).json({ message: "Provide reporterName or finderId" });
      }

      const police = await Police.findOne({ policeId });
      if (!police) {
        return res.status(404).json({ message: "Invalid policeId" });
      }

      // Handover to parent
      if (reporterName) {
        const parent = await MissingChild.findOne({ reporterName });
        if (!parent) {
          return res.status(404).json({ message: "Reporter name not found" });
        }

        await MissingChild.findByIdAndUpdate(
          parent._id,
          {
            status: "Handover",
            handoverByPolice: policeId,
            ...(reporterImage && { reporterPhoto: reporterImage })
          }
        );

        await FoundChildReport.findByIdAndUpdate(
          reportId,
          {
            status: "Handover",
            handoverByPolice: policeId,
            ...(reporterImage && { reporterPhoto: reporterImage })
          }
        );

        return res.status(200).json({ message: "Report updated to Handover" });
      }

      // Handover to finder
      if (finderId) {
        await FoundChildReport.findByIdAndUpdate(
          reportId,
          {
            status: "Handover",
            handoverByPolice: policeId,
            ...(reporterImage && { reporterPhoto: reporterImage })
          }
        );

        return res.status(200).json({ message: "Report updated to Handover" });
      }

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ======================================
  // ✅ Parent Lookup
  // ======================================
  parentNameMatchWithMissingReport: async (req, res) => {
    try {
      const { reporterName } = req.body;

      if (!reporterName) {
        return res.status(400).json({ message: "Missing reporterName" });
      }

      const parent = await MissingChild.findOne({ reporterName });

      if (!parent) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.status(200).json({ message: parent });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = foundChildController;
