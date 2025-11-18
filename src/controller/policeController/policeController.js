// const Police = require("../../models/police");
// const Role = require("../../models/role");
// const JWT = require("jsonwebtoken");
// const Config = require("../../config/config");

// const policeController = {
//   // ✅ Create Police
//     createPolice: async (req, res) => {
//     try {
//       const { name, policeId, stationName, location, phone } = req.body;

//       if (!name || !policeId || !stationName || !location || !phone) {
//         return res.status(400).json({ message: "All fields are required" });
//       }

//       const existing = await Police.findOne({ policeId });
//       if (existing) {
//         return res.status(400).json({ message: "Police ID already exists" });
//       }

//       const role = await Role.findOne({ name: "Police" });
//       if (!role) {
//         return res.status(404).json({ message: "Default role not found" });
//       }

//       // ✅ Use uploaded file or default image
//       const photoPath = req.file
//         ? `/uploads/${req.file.filename}`
//         : "https://example.com/default-police-photo.jpg";

//       const newPolice = await Police.create({
//         name,
//         policeId,
//         stationName,
//         location,
//         phone,
//         photo: photoPath,
//         roleId: role._id,
//       });

//       res.status(201).json({
//         message: "Police record created successfully",
//         police: newPolice,
//       });
//     } catch (error) {
//       console.error("❌ Error creating police:", error);
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // ✅ Police Login
//   loginPolice: async (req, res) => {
//     try {
//       const { policeId, phone } = req.body;

//       if (!policeId || !phone) {
//         return res
//           .status(400)
//           .json({ message: "Missing required fields: policeId or phone" });
//       }

//       const police = await Police.findOne({ policeId, phone }).populate("roleId");
//       if (!police) {
//         return res.status(404).json({ message: "Invalid Police ID or Phone number" });
//       }

//       const token = JWT.sign(
//         { id: police._id, role: police.roleId.name },
//         Config.SECRET_KEY,
//         { expiresIn: "1d" }
//       );

//       res.status(200).json({
//         message: "Login successful",
//         police: {
//           id: police._id,
//           name: police.name,
//           policeId: police.policeId,
//           stationName: police.stationName,
//           location: police.location,
//           phone: police.phone,
//           photo: police.photo,
//           role: police.roleId.name,
//           status: police.status,
//         },
//         token,
//       });
//     } catch (error) {
//       console.error("❌ Error logging in police:", error);
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // ✅ Get All Police
//   getAllPolice: async (req, res) => {
//     try {
//       const policeList = await Police.find().populate("roleId", "name");

//       if (!policeList.length) {
//         return res.status(404).json({ message: "No police records found" });
//       }

//       res.status(200).json({
//         message: "Police records fetched successfully",
//         total: policeList.length,
//         data: policeList,
//       });
//     } catch (error) {
//       console.error("❌ Error fetching police list:", error);
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // ✅ Get One Police by ID
//   getPoliceById: async (req, res) => {
//     try {
//       const { id } = req.params;

//       const police = await Police.findById(id).populate("roleId", "name");
//       if (!police) {
//         return res.status(404).json({ message: "Police not found" });
//       }

//       res.status(200).json({
//         message: "Police fetched successfully",
//         data: police,
//       });
//     } catch (error) {
//       console.error("❌ Error fetching police by ID:", error);
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // ✅ Update Police
// // ✅ Update Police (Status or Any Field)
// updatePolice: async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     // Remove null/empty values
//     Object.keys(updates).forEach((key) => {
//       if (updates[key] === "" || updates[key] === null || updates[key] === undefined) {
//         delete updates[key];
//       }
//     });

//     const updatedPolice = await Police.findByIdAndUpdate(id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedPolice) {
//       return res.status(404).json({ message: "Police not found" });
//     }

//     res.status(200).json({
//       message: "Police record updated successfully",
//       data: updatedPolice,
//     });
//   } catch (error) {
//     console.error("❌ Error updating police:", error);
//     res.status(500).json({ message: error.message });
//   }
// },

// // ✅ Update Police Status (Active / Inactive)
// updateStatus: async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     // Validate status field
//     if (!status || !["Active", "Inactive"].includes(status)) {
//       return res
//         .status(400)
//         .json({ message: "Status must be either 'Active' or 'Inactive'" });
//     }

//     const police = await Police.findById(id);
//     if (!police) {
//       return res.status(404).json({ message: "Police not found" });
//     }

//     police.status = status;
//     await police.save();

//     res.status(200).json({
//       message: `Police status updated to ${status}`,
//       data: police,
//     });
//   } catch (error) {
//     console.error("❌ Error updating police status:", error);
//     res.status(500).json({ message: error.message });
//   }
// },


//   // ✅ Delete Police
//   deletePolice: async (req, res) => {
//     try {
//       const { id } = req.params;

//       const deletedPolice = await Police.findByIdAndDelete(id);
//       if (!deletedPolice) {
//         return res.status(404).json({ message: "Police not found" });
//       }

//       res.status(200).json({ message: "Police deleted successfully",deletedPolice });
//     } catch (error) {
//       console.error("❌ Error deleting police:", error);
//       res.status(500).json({ message: error.message });
//     }
//   },
// };

// module.exports = policeController;


const Police = require("../../models/police");
const Role = require("../../models/role");
const JWT = require("jsonwebtoken");
const Config = require("../../config/config");
const { Expo } = require("expo-server-sdk");       // ✅ Expo SDK

const expo = new Expo();

const policeController = {
  // ✅ Create Police
  createPolice: async (req, res) => {
    try {
      const { name, policeId, stationName, location, phone } = req.body;

      if (!name || !policeId || !stationName || !location || !phone) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existing = await Police.findOne({ policeId });
      if (existing) {
        return res.status(400).json({ message: "Police ID already exists" });
      }

      const role = await Role.findOne({ name: "Police" });
      if (!role) {
        return res.status(404).json({ message: "Default role not found" });
      }

      const photoPath = req.file
        ? `/uploads/${req.file.filename}`
        : "https://example.com/default-police-photo.jpg";

      const newPolice = await Police.create({
        name,
        policeId,
        stationName,
        location,
        phone,
        photo: photoPath,
        roleId: role._id,
      });

      res.status(201).json({
        message: "Police record created successfully",
        police: newPolice,
      });
    } catch (error) {
      console.error("❌ Error creating police:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Police Login
  loginPolice: async (req, res) => {
    try {
      const { policeId, phone } = req.body;

      if (!policeId || !phone) {
        return res
          .status(400)
          .json({ message: "Missing required fields: policeId or phone" });
      }

      const police = await Police.findOne({ policeId, phone }).populate("roleId");
      if (!police) {
        return res.status(404).json({ message: "Invalid Police ID or Phone number" });
      }

      const token = JWT.sign(
        { id: police._id, role: police.roleId.name },
        Config.SECRET_KEY,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Login successful",
        police: {
          id: police._id,
          name: police.name,
          policeId: police.policeId,
          stationName: police.stationName,
          location: police.location,
          phone: police.phone,
          photo: police.photo,
          role: police.roleId.name,
          status: police.status,
        },
        token,
      });
    } catch (error) {
      console.error("❌ Error logging in police:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get All Police
  getAllPolice: async (req, res) => {
    try {
      const policeList = await Police.find().populate("roleId", "name");

      if (!policeList.length) {
        return res.status(404).json({ message: "No police records found" });
      }

      res.status(200).json({
        message: "Police records fetched successfully",
        total: policeList.length,
        data: policeList,
      });
    } catch (error) {
      console.error("❌ Error fetching police list:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get Police By ID
  getPoliceById: async (req, res) => {
    try {
      const { id } = req.params;

      const police = await Police.findById(id).populate("roleId", "name");
      if (!police) {
        return res.status(404).json({ message: "Police not found" });
      }

      res.status(200).json({
        message: "Police fetched successfully",
        data: police,
      });
    } catch (error) {
      console.error("❌ Error fetching police by ID:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Update Police
  updatePolice: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      Object.keys(updates).forEach((key) => {
        if (updates[key] === "" || updates[key] === null || updates[key] === undefined) {
          delete updates[key];
        }
      });

      const updatedPolice = await Police.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedPolice) {
        return res.status(404).json({ message: "Police not found" });
      }

      res.status(200).json({
        message: "Police record updated successfully",
        data: updatedPolice,
      });
    } catch (error) {
      console.error("❌ Error updating police:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Update Status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !["Active", "Inactive"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be either 'Active' or 'Inactive'" });
      }

      const police = await Police.findById(id);
      if (!police) {
        return res.status(404).json({ message: "Police not found" });
      }

      police.status = status;
      await police.save();

      res.status(200).json({
        message: `Police status updated to ${status}`,
        data: police,
      });
    } catch (error) {
      console.error("❌ Error updating police status:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Delete Police
  deletePolice: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedPolice = await Police.findByIdAndDelete(id);
      if (!deletedPolice) {
        return res.status(404).json({ message: "Police not found" });
      }

      res.status(200).json({ message: "Police deleted successfully", deletedPolice });
    } catch (error) {
      console.error("❌ Error deleting police:", error);
      res.status(500).json({ message: error.message });
    }
  },

  //  Save Expo Push Token
savePushToken : async (req, res) => {
  try {
    const { policeId, expoPushToken } = req.body;
    if (!Expo.isExpoPushToken(expoPushToken))
      return res.status(400).json({ message: "Invalid Expo token" });

    const police = await Police.findOneAndUpdate(
      { policeId },
      { expoPushToken },
      { new: true }
    );
    if (!police) return res.status(404).json({ message: "Police not found" });

    res.json({ message: "Push token saved", police });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},
};

module.exports = policeController;
