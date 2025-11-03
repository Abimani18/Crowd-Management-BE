const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique:true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
    required: true,
  },
});

module.exports = mongoose.model("user",userSchema);
