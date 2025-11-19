const Volunteer = require("../../models/volunteers");


const volunteerController = {

  // ====================================
  // ✅ Create Volunteer
  // ====================================
  createVolunteer: async (req, res) => {
    try {
      const { name, phone, gender } = req.body;

      if (!name || !phone || !gender) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existing = await Volunteer.findOne({ phone });
      if (existing) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      const photoPath = req.file
        ? `/uploads/${req.file.filename}`
        : "https://example.com/default-photo.jpg";

      const newVolunteer = await Volunteer.create({
        name,
        phone,
        gender,
        photo: photoPath,
      });

      res.status(201).json({
        message: "Volunteer created successfully",
        volunteer: newVolunteer,
      });
    } catch (error) {
      console.error("❌ Error creating volunteer:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ====================================
  // ❌ If you don’t want Login, remove this
  // ====================================
  loginVolunteer: async (req, res) => {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ message: "Phone number required" });
      }

      const volunteer = await Volunteer.findOne({ phone });
      if (!volunteer) {
        return res.status(404).json({ message: "Invalid phone number" });
      }

      res.status(200).json({
        message: "Login successful",
        volunteer,
      });
    } catch (error) {
      console.error("❌ Error logging in volunteer:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ====================================
  // ✅ Get All Volunteers
  // ====================================
  getAllVolunteers: async (req, res) => {
    try {
      const volunteers = await Volunteer.find();

      if (!volunteers.length) {
        return res.status(404).json({ message: "No volunteers found" });
      }

      res.status(200).json({
        message: "Volunteers fetched successfully",
        total: volunteers.length,
        data: volunteers,
      });
    } catch (error) {
      console.error("❌ Error fetching volunteers:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ====================================
  // ✅ Get Volunteer by ID
  // ====================================
  getVolunteerById: async (req, res) => {
    try {
      const { id } = req.params;

      const volunteer = await Volunteer.findById(id);
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }

      res.status(200).json({
        message: "Volunteer fetched successfully",
        data: volunteer,
      });
    } catch (error) {
      console.error("❌ Error fetching volunteer:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ====================================
  // ✅ Update Volunteer
  // ====================================
  updateVolunteer: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      Object.keys(updates).forEach((key) => {
        if (!updates[key]) delete updates[key];
      });

      const updatedVolunteer = await Volunteer.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedVolunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }

      res.status(200).json({
        message: "Volunteer updated successfully",
        data: updatedVolunteer,
      });
    } catch (error) {
      console.error("❌ Error updating volunteer:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ====================================
  // ✅ Update Volunteer Status (Active/Inactive)
  // ====================================
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !["Active", "Inactive"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be either 'Active' or 'Inactive'" });
      }

      const volunteer = await Volunteer.findById(id);
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }

      volunteer.status = status;
      await volunteer.save();

      res.status(200).json({
        message: `Volunteer status updated to ${status}`,
        data: volunteer,
      });
    } catch (error) {
      console.error("❌ Error updating status:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // ====================================
  // ✅ Delete Volunteer
  // ====================================
  deleteVolunteer: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedVolunteer = await Volunteer.findByIdAndDelete(id);
      if (!deletedVolunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }

      res.status(200).json({
        message: "Volunteer deleted successfully",
        deletedVolunteer,
      });
    } catch (error) {
      console.error("❌ Error deleting volunteer:", error);
      res.status(500).json({ message: error.message });
    }
  },

};

module.exports = volunteerController;
