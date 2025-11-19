// const FoundChildReport = require("../../models/report");
// const MissingChild = require("../../models/missing");

// const foundChildController = {
//   // ✅ Police reports a found child
//   createFoundReport: async (req, res) => {
//     try {
//       const {
//         childName,
//         childPhoto,
//         estimatedAge,
//         gender,
//         dressDescription,
//         foundLocation,
//         description,
//       } = req.body;

//       if (!childPhoto || !foundLocation) {
//         return res.status(400).json({
//           message: "childPhoto and foundLocation are required",
//         });
//       }

//       const newFound = await FoundChildReport.create({
//         foundBy: req.user._id, // police user
//         childName,
//         childPhoto,
//         estimatedAge,
//         gender,
//         dressDescription,
//         foundLocation,
//         description,
//       });

//       res.status(201).json({
//         message: "Found child report created successfully",
//         report: newFound,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // ✅ Get all found child reports
//   getAllFoundReports: async (req, res) => {
//     try {
//       const reports = await FoundChildReport.find()
//         .populate("foundBy", "name stationName phone")
//         .populate("matchedMissingReport", "childName parentName parentPhone")
//         .sort({ createdAt: -1 });

//       res.status(200).json({ reports });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // ✅ Get a particular found child report by ID
// getFoundReportById: async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the found report and populate related data
//     const report = await FoundChildReport.findById(id)
//       .populate("foundBy", "name stationName phone")
//       .populate("matchedMissingReport", "childName parentName parentPhone");

//     if (!report) {
//       return res.status(404).json({ message: "Found child report not found" });
//     }

//     res.status(200).json({ report });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// },

//   // ✅ Link found child to missing report (manual match)
//   matchWithMissingReport: async (req, res) => {
//     try {
//       const { foundId, missingId } = req.body;

//       const found = await FoundChildReport.findById(foundId);
//       const missing = await MissingChild.findById(missingId);

//       if (!found || !missing) {
//         return res.status(404).json({ message: "Invalid IDs provided" });
//       }

//       found.matchedMissingReport = missingId;
//       found.status = "Identified";
//       await found.save();

//       missing.status = "Found";
//       await missing.save();

//       res.status(200).json({
//         message: "Match successful",
//         found,
//         missing,
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },
// };

// module.exports = foundChildController;


const FoundChildReport = require("../../models/report");
const MissingChild = require("../../models/missing");

const foundChildController = {
 createFoundReport: async (req, res) => {
  try {
    const {
      childName,
      childPhoto,
      estimatedAge,
      gender,
      fromWhere,
      language,
      dressDescription,
      foundLocation,
      description,
      foundAt, // ✅ Manual input like "20-3-2025, 11.10"
    } = req.body;

    if (!childPhoto || !foundLocation) {
      return res.status(400).json({
        message: "childPhoto and foundLocation are required",
      });
    }

    // ✅ Parse manual foundAt if provided
    let foundDate;
    if (foundAt) {
      // Handle "20-3-2025, 11.10" or "20/3/2025 11:10"
      const cleaned = foundAt.replace(",", "").replace(".", ":");
      const [datePart, timePart] = cleaned.split(" ");
      const [day, month, year] = datePart.split(/[-/]/);
      const formattedString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart || "00:00"}`;
      foundDate = new Date(formattedString);
    } else {
      foundDate = new Date(); // default current date/time
    }

    // ✅ Create record
    const newFound = await FoundChildReport.create({
      foundBy: req.user._id,
      childName,
      childPhoto,
      language,
      estimatedAge,
      gender,
      fromWhere,
      dressDescription,
      foundLocation,
      description,
      foundAt: foundDate,
    });

    // ✅ Populate police info for response
    const populatedReport = await FoundChildReport.findById(newFound._id)
      .populate("foundBy", "name policeId stationName phone");

    res.status(201).json({
      message: "Found child report created successfully",
      report: {
        _id: populatedReport._id,
        childName: populatedReport.childName,
        gender: populatedReport.gender,
        estimatedAge: populatedReport.estimatedAge,
        dressDescription: populatedReport.dressDescription,
        foundLocation: populatedReport.foundLocation,
        description: populatedReport.description,
        language: populatedReport.language,
        fromWhere: populatedReport.fromWhere,
        photo: populatedReport.childPhoto,
        status: populatedReport.status,
        createdAt: new Date(populatedReport.createdAt).toLocaleString("en-IN"),
        foundAt: new Date(populatedReport.foundAt).toLocaleString("en-IN"),
        policeOfficer: {
          name: populatedReport.foundBy?.name,
          policeId: populatedReport.foundBy?.policeId,
          stationName: populatedReport.foundBy?.stationName,
          phone: populatedReport.foundBy?.phone,
        },
      },
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
        .populate("foundBy", "name policeId stationName phone")
        .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation")
        .sort({ createdAt: -1 });

      const formattedReports = reports.map((r) => ({
        _id: r._id,
        childName: r.childName,
        gender: r.gender,
        estimatedAge: r.estimatedAge,
        photo: r.childPhoto,
        foundLocation: r.foundLocation,
        status: r.status,
        createdAt: new Date(r.createdAt).toLocaleString("en-IN"),
        foundAt: new Date(r.foundAt).toLocaleString("en-IN"),
        policeOfficer: {
          name: r.foundBy?.name,
          policeId: r.foundBy?.policeId,
          stationName: r.foundBy?.stationName,
          phone: r.foundBy?.phone,
        },
        matchedMissingReport: r.matchedMissingReport
          ? {
              name: r.matchedMissingReport.childName,
              parentName: r.matchedMissingReport.parentName,
              parentPhone: r.matchedMissingReport.parentPhone,
              lastSeenLocation: r.matchedMissingReport.lastSeenLocation,
              dateMissing: new Date(r.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
            }
          : null,
      }));

      res.status(200).json({
        message: "All found child reports fetched successfully",
        count: formattedReports.length,
        reports: formattedReports,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get a particular found child report by ID
  getFoundReportById: async (req, res) => {
    try {
      const { id } = req.params;
      const report = await FoundChildReport.findById(id)
        .populate("foundBy", "name policeId stationName phone")
        .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation");

      if (!report) {
        return res.status(404).json({ message: "Found child report not found" });
      }

      res.status(200).json({
        _id: report._id,
        childName: report.childName,
        gender: report.gender,
        foundLocation: report.foundLocation,
        status: report.status,
        createdAt: new Date(report.createdAt).toLocaleString("en-IN"),
        foundAt: new Date(report.foundAt).toLocaleString("en-IN"),
        policeOfficer: {
          name: report.foundBy?.name,
          policeId: report.foundBy?.policeId,
          stationName: report.foundBy?.stationName,
          phone: report.foundBy?.phone,
        },
        matchedMissingReport: report.matchedMissingReport
          ? {
              name: report.matchedMissingReport.childName,
              parentName: report.matchedMissingReport.parentName,
              parentPhone: report.matchedMissingReport.parentPhone,
              lastSeenLocation: report.matchedMissingReport.lastSeenLocation,
              dateMissing: new Date(report.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
            }
          : null,
      });
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

    // ✅ Copy missing date into found report
    found.matchedMissingReport = missingId;
    found.missingDate = missing.dateMissing; // store missing date/time
    found.status = "Identified";
    await found.save();

    // ✅ Update missing record
    missing.status = "Found";
    missing.foundAt = new Date();
    await missing.save();

    // ✅ Populate for response
    const populatedFound = await FoundChildReport.findById(found._id)
      .populate("foundBy", "name policeId stationName phone")
      .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation");

    res.status(200).json({
      message: "Match successful",
      found: {
        id: populatedFound._id,
        childName: populatedFound.childName,
        gender: populatedFound.gender,
        foundLocation: populatedFound.foundLocation,
        status: populatedFound.status,
        missingDate: new Date(populatedFound.missingDate).toLocaleString("en-IN"),
        foundAt: new Date(populatedFound.foundAt).toLocaleString("en-IN"),
        policeOfficer: {
          name: populatedFound.foundBy?.name,
          policeId: populatedFound.foundBy?.policeId,
          stationName: populatedFound.foundBy?.stationName,
          phone: populatedFound.foundBy?.phone,
        },
        matchedMissingReport: populatedFound.matchedMissingReport
          ? {
              name: populatedFound.matchedMissingReport.childName,
              parentName: populatedFound.matchedMissingReport.parentName,
              parentPhone: populatedFound.matchedMissingReport.parentPhone,
              lastSeenLocation: populatedFound.matchedMissingReport.lastSeenLocation,
              dateMissing: new Date(populatedFound.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
            }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

// ✅ Get all complete case details (found + missing + police)
getAllFoundFullDetails: async (req, res) => {
  try {
    // Fetch all found reports with linked missing reports and officer details
    const reports = await FoundChildReport.find()
      .populate("foundBy", "name policeId stationName phone")
      .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation status")
      .sort({ createdAt: -1 });

    if (!reports.length) {
      return res.status(404).json({ message: "No found child reports available" });
    }

    // Format each report
    const detailedReports = reports.map((r) => ({
      foundReportId: r._id,
      childName: r.childName || "Unknown",
      gender: r.gender || "N/A",
      estimatedAge: r.estimatedAge || "N/A",
      foundLocation: r.foundLocation,
      dressDescription: r.dressDescription || "N/A",
      description: r.description || "N/A",
      status: r.status,
      missingDate: r.missingDate ? new Date(r.missingDate).toLocaleString("en-IN") : "Not linked yet",
      foundDate: r.foundAt ? new Date(r.foundAt).toLocaleString("en-IN") : "N/A",

      policeOfficer: {
        name: r.foundBy?.name || "N/A",
        policeId: r.foundBy?.policeId || "N/A",
        stationName: r.foundBy?.stationName || "N/A",
        phone: r.foundBy?.phone || "N/A",
      },

      // ✅ Linked missing child details
      matchedMissingReport: r.matchedMissingReport
        ? {
            missingReportId: r.matchedMissingReport._id,
            childName: r.matchedMissingReport.childName,
            parentName: r.matchedMissingReport.parentName,
            parentPhone: r.matchedMissingReport.parentPhone,
            lastSeenLocation: r.matchedMissingReport.lastSeenLocation,
            dateMissing: new Date(r.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
            missingStatus: r.matchedMissingReport.status,
          }
        : "No linked missing report",
    }));

    res.status(200).json({
      message: "All detailed found child case records fetched successfully",
      total: detailedReports.length,
      reports: detailedReports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching detailed reports", error: error.message });
  }
},

};

module.exports = foundChildController;
