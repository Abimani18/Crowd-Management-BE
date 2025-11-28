const FoundChildReport = require("../../models/report");
const MissingChild = require("../../models/missing");
const handoverdata = require("../../models/handover");

const handOverController = {
  caseclose: async (req, res) => {
    try {
      const { reporterName, reporterPhone } = req.body;
      const reportId = req.params.id;

      const reporterImage =  req.file.location;

      const foundReport = await FoundChildReport.findById(reportId);

      const matchingMissing = await MissingChild.findOne({
        reporterPhone,
      });

      if (foundReport) {
        if (matchingMissing) {
          await FoundChildReport.findByIdAndUpdate(reportId, {
            status: "Handover",
          });

          await MissingChild.findByIdAndUpdate(matchingMissing._id, {
            status: "Handover",
          });

          const newdata = await handoverdata({
            reporterName,
            reporterPhone,
            foundchildID: reportId,
            missingreportID: matchingMissing._id,
            reporterImage,
            status: "Handover",
          }).save();

          return res.json({
            newdata,
            message: "Found report updated and missing report also updated",
          });
        }

         await FoundChildReport.findByIdAndUpdate(reportId, {
            status: "Handover",
          });

        const newdata = await handoverdata({
          reporterName,
          reporterPhone,
          foundchildID: reportId,
          reporterImage,
          status: "Handover",
        }).save();

        return res.json({
          newdata,
          message: "Found report marked as handover",
        });
      }

      const missingReport = await MissingChild.findById(reportId);
      if (missingReport) {
        await MissingChild.findByIdAndUpdate(reportId ,{
            status: "Handover",
          });

        const newdata = await handoverdata({
          reporterName,
          reporterPhone,
          missingreportID: reportId,
          reporterImage,
          status: "Handover",
        }).save();

        return res.json({
          newdata,
          message: "Missing report marked as handover",
        });
      }

      res.status(404).json({ message: "Report not found" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};

module.exports = handOverController;
