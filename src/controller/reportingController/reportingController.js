
const FoundChildReport = require("../../models/report");
const MissingChild = require("../../models/missing");
const Police = require("../../models/police");

const foundChildController = {
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
      foundAt, // ✅ Manual input like "20-3-2025, 11.10"
    } = req.body;

    if (!req.file || !foundLocation) {
      return res.status(400).json({
        message: "childPhoto (file) and foundLocation are required",
      });
    }

   const childPhotoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
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
        dressDescription:r.dressDescription,
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

    // Update found child
    await FoundChildReport.updateOne(
      { _id: foundId },
      {
        matchedMissingReport: missingId,
        missingDate: missing.dateMissing,
        status: "Found",
      }
    );

    // Update missing child safely
    await MissingChild.updateOne(
      { _id: missingId },
      { status: "Found", foundAt: new Date() }
    );

    const populatedFound = await FoundChildReport.findById(foundId)
      .populate("foundBy", "name policeId stationName phone")
      .populate("matchedMissingReport", "childName parentName parentPhone dateMissing lastSeenLocation");

    res.status(200).json({
      message: "Match successful",
      found: populatedFound,
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


caseClose: async(req,res) =>{
  try {
     const {policeId,reporterName,finderId} = req.body;
     const reportId = req.params.id;
     const reporterImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
     console.log(reporterImage)
     if(!policeId){
      return res.status(401).json({message:"police id is required"})
     }
     if (!reporterName && !finderId) {
      return res.status(400).json({ message: "Provide either parentName or finderId" });
    }
    if(!reportId){
      return res.status(401).json({message:"missing reportId"})
     }


     const police = await Police.findOne({policeId});
     if(!police){
      return res.status(401).json({message:"inValid policeId"})
     }

    if(reporterName){
     const parent = await MissingChild.findOne({reporterName});
        if(!parent){return res.status(404).json({message:"reporter name  not found"})}

     const missingUpdate = await MissingChild.findByIdAndUpdate(parent._id, { status: "Handover", handoverByPolice:policeId,...(reporterImage && { reporterPhoto: reporterImage }) },{ new: true })
        if(!missingUpdate){return res.status(404).json({message:"report not found"})}

     const foundUpdate = await FoundChildReport.findByIdAndUpdate(reportId,{ status: "Handover", handoverByPolice:policeId ,...(reporterImage && { reporterPhoto: reporterImage })},{ new: true });
          if(!foundUpdate){return res.status(404).json({message:"report not found"})}
        
      return res.status(200).json({
        message: "Report updated to Handover",
      });  
    }
    if(finderId)
    {

      if(!finderId){
      return res.status(401).json({message:"inValid policeId"})
      }

      const foundUpdate = await FoundChildReport.findByIdAndUpdate(reportId,{ status: "Handover", handoverByPolice:policeId,...(reporterImage && { reporterPhoto: reporterImage }) },{ new: true });
          if(!foundUpdate){return res.status(404).json({message:"report not found"})}
        
      return res.status(200).json({
        message: "Report updated to Handover",
      });  
    }
  } 
  catch (error) {
    res.status(500).json({message:error.message})
  }
},

parentNameMatchWithMissingReport: async (req,res) =>{
   const {reporterName}= req.body;
   console.log("body :",req.body)
   
   if(!reporterName){
    return res.status(404).json({message:"missing parentName"})
   }
   const reporter = await MissingChild.findOne({reporterName});
   console.log("reporter ",reporter);
   if(!reporter){
    return res.status(404).json({message:"report not found"})
   }
   res.status(200).json({message:reporter})
}

};

module.exports = foundChildController;
