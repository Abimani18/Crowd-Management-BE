const Police = require("../../models/polish");
const Role = require("../../models/role");
const JWT = require("jsonwebtoken");
const Config = require("../../config/config")

const policeController = ({
createPolice : async (req, res) => {
  try {
    const { name, policeId, stationName, location, phone } = req.body;

    // ✅ Validate input
    if (!name || !policeId || !stationName || !location || !phone ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check duplicate
    const existing = await Police.findOne({ policeId });
    if (existing) {
      return res.status(400).json({ message: "Police ID already exists" });
    }

   const role = await Role.findOne({name:"Police"})
  if(!role){
    return res.status(404).json({message:"Default role not found"})
  }
    // ✅ Save new record
    const newPolice = await Police.create({
      name,
      policeId,
      stationName,
      location,
      phone,
      roleId:role._id
    });

    res.status(201).json({
      message: "Police record created successfully",
      police: newPolice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},
loginPolice: async (req, res) => {
    try {
      const { policeId, phone } = req.body;

      // Validate input
      if (!policeId || !phone) {
        return res
          .status(400)
          .json({ message: "Missing required fields: policeId or phone" });
      }

      // Find police record
      const police = await Police.findOne({ policeId, phone }).populate("roleId");

      if (!police) {
        return res
          .status(404)
          .json({ message: "Invalid Police ID or Phone number" });
      }

      // Generate JWT token
      const token = JWT.sign(
        {
          id: police._id,
          role: police.roleId.name,
        },
        Config.SECRET_KEY, // or use from config
        { expiresIn: "1d" }
      );

      // Response
      res.status(200).json({
        message: "Login successful",
        police: {
          id: police._id,
          name: police.name,
          policeId: police.policeId,
          stationName: police.stationName,
          location: police.location,
          role: police.roleId.name,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})

module.exports = policeController;
