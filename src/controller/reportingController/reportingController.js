
// const FoundChildReport = require("../../models/report");
// const MissingChild = require("../../models/missing");
// const Police = require("../../models/police");

// const foundChildController = {
// createFoundReport: async (req, res) => {
//   try {
//     const {
//       childName,
//       childPhoto,
//       estimatedAge,
//       gender,
//       fromWhere,
//       language,
//       dressDescription,
//       foundLocation,
//       description,
//       foundTime,   // ⬅️ FIXED NAME: matches schema
//     } = req.body;

//     // ================================
//     // 🛑 Required fields check
//     // ================================
//     if (!childPhoto || !foundLocation) {
//       return res.status(400).json({
//         message: "childPhoto and foundLocation are required",
//       });
//     }

//     // ================================
//     // 🕒 Parse manual foundTime
//     // supports formats:
//     // "20-3-2025, 11.10"
//     // "20/3/2025 11:10"
//     // "20-03-2025 11:10"
//     // ================================
//     let parsedFoundTime;

//     if (foundTime) {
//       try {
//         const cleaned = foundTime.replace(",", "").replace(".", ":");
//         const [datePart, timePart] = cleaned.split(" ");
//         const [day, month, year] = datePart.split(/[-/]/);

//         const formatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart || "00:00"}`;
//         parsedFoundTime = new Date(formatted);
//       } catch (err) {
//         return res.status(400).json({ message: "Invalid foundTime format" });
//       }
//     } else {
//       parsedFoundTime = new Date(); // default: now
//     }

//     // ================================
//     // 🟢 Create new FoundChildReport
//     // ================================
//     const newFound = await FoundChildReport.create({
//       foundBy: req.user._id,
//       childName,
//       childPhoto,
//       estimatedAge,
//       gender,
//       fromWhere,
//       language,
//       dressDescription,
//       foundLocation,
//       description,
//       foundTime: parsedFoundTime,   // ⬅️ FIXED KEY
//     });

//     // ================================
//     // 🔍 Populate police officer details
//     // ================================
//     const populatedReport = await FoundChildReport.findById(newFound._id)
//       .populate("foundBy", "name policeId stationName phone");

//     // ================================
//     // 📤 Send formatted response
//     // ================================
//     res.status(201).json({
//       message: "Found child report created successfully",
//       report: {
//         _id: populatedReport._id,
//         childName: populatedReport.childName,
//         gender: populatedReport.gender,
//         estimatedAge: populatedReport.estimatedAge,
//         dressDescription: populatedReport.dressDescription,
//         foundLocation: populatedReport.foundLocation,
//         description: populatedReport.description,
//         language: populatedReport.language,
//         fromWhere: populatedReport.fromWhere,
//         childPhoto: populatedReport.childPhoto,
//         status: populatedReport.status,

//         createdAt: new Date(populatedReport.createdAt).toLocaleString("en-IN"),
//         foundTime: new Date(populatedReport.foundTime).toLocaleString("en-IN"),

//         policeOfficer: {
//           name: populatedReport.foundBy?.name,
//           policeId: populatedReport.foundBy?.policeId,
//           stationName: populatedReport.foundBy?.stationName,
//           phone: populatedReport.foundBy?.phone,
//         },
//       },
//     });

//   } catch (error) {
//     console.error("Found Report Error:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// },


//   // ✅ Get all found child reports
//   getAllFoundReports: async (req, res) => {
//     try {
//       const reports = await FoundChildReport.find()
//         .populate("foundBy", "name policeId stationName phone")
//         .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation")
//         .sort({ createdAt: -1 });

//       const formattedReports = reports.map((r) => ({
//         _id: r._id,
//         childName: r.childName,
//         gender: r.gender,
//         estimatedAge: r.estimatedAge,
//         photo: r.childPhoto,
//         foundLocation: r.foundLocation,
//         status: r.status,
//         createdAt: new Date(r.createdAt).toLocaleString("en-IN"),
//         foundAt: new Date(r.foundAt).toLocaleString("en-IN"),
//         policeOfficer: {
//           name: r.foundBy?.name,
//           policeId: r.foundBy?.policeId,
//           stationName: r.foundBy?.stationName,
//           phone: r.foundBy?.phone,
//         },
//         matchedMissingReport: r.matchedMissingReport
//           ? {
//               name: r.matchedMissingReport.childName,
//               parentName: r.matchedMissingReport.parentName,
//               parentPhone: r.matchedMissingReport.parentPhone,
//               lastSeenLocation: r.matchedMissingReport.lastSeenLocation,
//               dateMissing: new Date(r.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
//             }
//           : null,
//       }));

//       res.status(200).json({
//         message: "All found child reports fetched successfully",
//         count: formattedReports.length,
//         reports: formattedReports,
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // ✅ Get a particular found child report by ID
//   getFoundReportById: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const report = await FoundChildReport.findById(id)
//         .populate("foundBy", "name policeId stationName phone")
//         .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation");

//       if (!report) {
//         return res.status(404).json({ message: "Found child report not found" });
//       }

//       res.status(200).json({
//         _id: report._id,
//         childName: report.childName,
//         gender: report.gender,
//         foundLocation: report.foundLocation,
//         status: report.status,
//         createdAt: new Date(report.createdAt).toLocaleString("en-IN"),
//         foundAt: new Date(report.foundAt).toLocaleString("en-IN"),
//         policeOfficer: {
//           name: report.foundBy?.name,
//           policeId: report.foundBy?.policeId,
//           stationName: report.foundBy?.stationName,
//           phone: report.foundBy?.phone,
//         },
//         matchedMissingReport: report.matchedMissingReport
//           ? {
//               name: report.matchedMissingReport.childName,
//               parentName: report.matchedMissingReport.parentName,
//               parentPhone: report.matchedMissingReport.parentPhone,
//               lastSeenLocation: report.matchedMissingReport.lastSeenLocation,
//               dateMissing: new Date(report.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
//             }
//           : null,
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // ✅ Link found child to missing report (manual match)
// matchWithMissingReport: async (req, res) => {
//   try {
//     const { foundId, missingId } = req.body;

//     const found = await FoundChildReport.findById(foundId);
//     const missing = await MissingChild.findById(missingId);

//     if (!found || !missing) {
//       return res.status(404).json({ message: "Invalid IDs provided" });
//     }

//     // Update found child
//     await FoundChildReport.updateOne(
//       { _id: foundId },
//       {
//         matchedMissingReport: missingId,
//         missingDate: missing.dateMissing,
//         status: "Found",
//       }
//     );

//     // Update missing child safely
//     await MissingChild.updateOne(
//       { _id: missingId },
//       { status: "Found", foundAt: new Date() }
//     );

//     const populatedFound = await FoundChildReport.findById(foundId)
//       .populate("foundBy", "name policeId stationName phone")
//       .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation");

//     res.status(200).json({
//       message: "Match successful",
//       found: populatedFound,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// },



// // ✅ Get all complete case details (found + missing + police)
// getAllFoundFullDetails: async (req, res) => {
//   try {
//     // Fetch all found reports with linked missing reports and officer details
//     const reports = await FoundChildReport.find()
//       .populate("foundBy", "name policeId stationName phone")
//       .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation status")
//       .sort({ createdAt: -1 });

//     if (!reports.length) {
//       return res.status(404).json({ message: "No found child reports available" });
//     }

//     // Format each report
//     const detailedReports = reports.map((r) => ({
//       foundReportId: r._id,
//       childName: r.childName || "Unknown",
//       gender: r.gender || "N/A",
//       estimatedAge: r.estimatedAge || "N/A",
//       foundLocation: r.foundLocation,
//       dressDescription: r.dressDescription || "N/A",
//       description: r.description || "N/A",
//       status: r.status,
//       missingDate: r.missingDate ? new Date(r.missingDate).toLocaleString("en-IN") : "Not linked yet",
//       foundDate: r.foundAt ? new Date(r.foundAt).toLocaleString("en-IN") : "N/A",

//       policeOfficer: {
//         name: r.foundBy?.name || "N/A",
//         policeId: r.foundBy?.policeId || "N/A",
//         stationName: r.foundBy?.stationName || "N/A",
//         phone: r.foundBy?.phone || "N/A",
//       },

//       // ✅ Linked missing child details
//       matchedMissingReport: r.matchedMissingReport
//         ? {
//             missingReportId: r.matchedMissingReport._id,
//             childName: r.matchedMissingReport.childName,
//             parentName: r.matchedMissingReport.parentName,
//             parentPhone: r.matchedMissingReport.parentPhone,
//             lastSeenLocation: r.matchedMissingReport.lastSeenLocation,
//             dateMissing: new Date(r.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
//             missingStatus: r.matchedMissingReport.status,
//           }
//         : "No linked missing report",
//     }));

//     res.status(200).json({
//       message: "All detailed found child case records fetched successfully",
//       total: detailedReports.length,
//       reports: detailedReports,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching detailed reports", error: error.message });
//   }
// },


// caseClose: async(req,res) =>{
//   try {
//      const {policeId,parentName,finderId} = req.body;
//      const reportId = req.params.id;
//      if(!policeId){
//       return res.status(401).json({message:"police id is required"})
//      }
//      if (!parentName && !finderId) {
//       return res.status(400).json({ message: "Provide either parentName or finderId" });
//     }
//     if(!reportId){
//       return res.status(401).json({message:"missing reportId"})
//      }


//      const police = await Police.findOne({policeId});
//      if(!police){
//       return res.status(401).json({message:"inValid policeId"})
//      }

//     if(parentName){
//      const parent = await MissingChild.findOne({parentName});
//         if(!parent){return res.status(404).json({message:"parentName not found"})}

//      const missingUpdate = await MissingChild.findByIdAndUpdate(parent._id, { status: "Handover", handoverByPolice:policeId },{ new: true })
//         if(!missingUpdate){return res.status(404).json({message:"report not found"})}

//      const foundUpdate = await FoundChildReport.findByIdAndUpdate(reportId,{ status: "Handover", handoverByPolice:policeId },{ new: true });
//           if(!foundUpdate){return res.status(404).json({message:"report not found"})}
        
//       return res.status(200).json({
//         message: "Report updated to Handover",
//       });  
//     }
//     if(finderId)
//     {

//       if(!finderId){
//       return res.status(401).json({message:"inValid policeId"})
//       }

//       const foundUpdate = await FoundChildReport.findByIdAndUpdate(reportId,{ status: "Handover", handoverByPolice:policeId },{ new: true });
//           if(!foundUpdate){return res.status(404).json({message:"report not found"})}
        
//       return res.status(200).json({
//         message: "Report updated to Handover",
//       });  
//     }
//   } 
//   catch (error) {
//     res.status(500).json({message:error.message})
//   }
// },

// parentNameMatchWithMissingReport: async (req,res) =>{
//    const {parentName} = req.body;
//    if(!parentName){
//     return res.status(404).json({message:"missing parentName"})
//    }
//    const parent = await MissingChild.findOne({parentName});
//    if(!parent){
//     return res.status(404).json({message:"report not found"})
//    }
//    res.status(200).json({message:parent})
// }

// };

// module.exports = foundChildController;



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
        childPhoto,
        estimatedAge,
        gender,
        fromWhere,
        language,
        dressDescription,
        foundLocation,
        description,
        foundTime,  // <- this is STRING in schema
      } = req.body;

      // Required fields
      if (!childPhoto || !foundLocation || !foundTime) {
        return res.status(400).json({
          message: "childPhoto, foundLocation, and foundTime are required",
        });
      }

      // ==================
      // 🕒 clean foundTime
      // input examples:
      // "20-3-2025, 11.10"
      // "20/03/2025 11:05"
      // ==================

      let formattedFoundTime = foundTime;

      try {
        const cleaned = foundTime.replace(",", "").replace(".", ":");
        const [datePart, timePart] = cleaned.split(" ");
        const [day, month, year] = datePart.split(/[-/]/);

        formattedFoundTime =
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart || "00:00"}`;

      } catch (err) {
        return res.status(400).json({ message: "Invalid foundTime format" });
      }

      // Create new record
      const newFound = await FoundChildReport.create({
        foundBy: req.user._id,
        childName,
        childPhoto,
        estimatedAge,
        gender,
        fromWhere,
        language,
        dressDescription,
        foundLocation,
        description,
        foundTime: formattedFoundTime,
      });

      const populated = await FoundChildReport.findById(newFound._id)
        .populate("foundBy", "name policeId stationName phone");

      res.status(201).json({
        message: "Found child report created successfully",
        report: {
          _id: populated._id,
          childName: populated.childName,
          gender: populated.gender,
          estimatedAge: populated.estimatedAge,
          dressDescription: populated.dressDescription,
          foundLocation: populated.foundLocation,
          description: populated.description,
          language: populated.language,
          fromWhere: populated.fromWhere,
          childPhoto: populated.childPhoto,
          foundTime: populated.foundTime,
          status: populated.status,

          createdAt: new Date(populated.createdAt).toLocaleString("en-IN"),

          policeOfficer: {
            name: populated.foundBy?.name,
            policeId: populated.foundBy?.policeId,
            stationName: populated.foundBy?.stationName,
            phone: populated.foundBy?.phone,
          },
        },
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
        foundTime: r.foundTime,
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
  // ✅ GET FOUND REPORT BY ID
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
        foundTime: r.foundTime,
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

      // Update found child
      await FoundChildReport.updateOne(
        { _id: foundId },
        {
          matchedMissingReport: missingId,
          missingDate: missing.dateMissing,
          status: "Found",
        }
      );

      // Update missing child
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
  // ✅ GET ALL FULL DETAILS (CASE VIEW)
  // ======================================
  getAllFoundFullDetails: async (req, res) => {
    try {
      const reports = await FoundChildReport.find()
        .populate("foundBy", "name policeId stationName phone")
        .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation status")
        .sort({ createdAt: -1 });

      const detailed = reports.map((r) => ({
        foundReportId: r._id,
        childName: r.childName,
        gender: r.gender,
        estimatedAge: r.estimatedAge,
        foundLocation: r.foundLocation,
        dressDescription: r.dressDescription,
        description: r.description,
        foundTime: r.foundTime,
        status: r.status,

        missingDate: r.missingDate
          ? new Date(r.missingDate).toLocaleString("en-IN")
          : "Not linked",

        foundDate: r.foundAt
          ? new Date(r.foundAt).toLocaleString("en-IN")
          : "N/A",

        policeOfficer: {
          name: r.foundBy?.name || "N/A",
          policeId: r.foundBy?.policeId || "N/A",
          stationName: r.foundBy?.stationName || "N/A",
          phone: r.foundBy?.phone || "N/A",
        },

        matchedMissingReport: r.matchedMissingReport
          ? {
              missingReportId: r.matchedMissingReport._id,
              childName: r.matchedMissingReport.childName,
              parentName: r.matchedMissingReport.parentName,
              parentPhone: r.matchedMissingReport.parentPhone,
              lastSeenLocation: r.matchedMissingReport.lastSeenLocation,
              dateMissing: new Date(r.matchedMissingReport.dateMissing).toLocaleString("en-IN"),
              status: r.matchedMissingReport.status,
            }
          : "No linked missing report",
      }));

      res.status(200).json({
        message: "Full details fetched successfully",
        total: detailed.length,
        reports: detailed,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  // ======================================
  // ✅ CASE CLOSE
  // ======================================
  caseClose: async (req, res) => {
    try {
      const { policeId, parentName, finderId } = req.body;
      const reportId = req.params.id;

      if (!policeId) {
        return res.status(400).json({ message: "policeId is required" });
      }
      if (!reportId) {
        return res.status(400).json({ message: "missing reportId" });
      }
      if (!parentName && !finderId) {
        return res.status(400).json({ message: "Provide parentName OR finderId" });
      }

      const police = await Police.findOne({ policeId });
      if (!police) {
        return res.status(404).json({ message: "Invalid policeId" });
      }

      // If handing over to parent
      if (parentName) {
        const parent = await MissingChild.findOne({ parentName });
        if (!parent) {
          return res.status(404).json({ message: "Parent not found" });
        }

        await MissingChild.updateOne(
          { _id: parent._id },
          { status: "Handover", handoverByPolice: policeId }
        );

        await FoundChildReport.updateOne(
          { _id: reportId },
          { status: "Handover", handoverByPolice: policeId }
        );

        return res.status(200).json({ message: "Handover completed successfully" });
      }

      // If handing over to finder
      if (finderId) {
        await FoundChildReport.updateOne(
          { _id: reportId },
          { status: "Handover", handoverByPolice: policeId }
        );

        return res.status(200).json({ message: "Handover completed successfully" });
      }

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  // ======================================
  // ✅ Find parent using name only
  // ======================================
  parentNameMatchWithMissingReport: async (req, res) => {
    try {
      const { parentName } = req.body;

      if (!parentName) {
        return res.status(400).json({ message: "parentName is required" });
      }

      const parent = await MissingChild.findOne({ parentName });

      if (!parent) {
        return res.status(404).json({ message: "Parent not found" });
      }

      res.status(200).json({ message: parent });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

};

module.exports = foundChildController;
