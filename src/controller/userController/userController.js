const User = require("../../models/user");
const Role = require("../../models/role");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const userController = {
  // 🟢 REGISTER USER
  register: async (req, res) => {
    try {
      const { name, password, roleId } = req.body;

      // Check missing fields
      if (!name || !password || !roleId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if role exists
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = new User({
        name,
        password: hashedPassword,
        roleId,
      });

      await newUser.save();

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔵 LOGIN USER
  login: async (req, res) => {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Find user by name
      const user = await User.findOne({ name }).populate("roleId");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Create JWT token
      const token = JWT.sign(
        {
          id: user._id,
          name: user.name,
          role: user.roleId.name,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Login successful",
        user,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
