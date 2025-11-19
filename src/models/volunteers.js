const mongoose = require("mongoose");

const volunteerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique:true
  },
   photo: {
    type: String, 
    required:true
  },
  gender:{
    type: String, 
    required:true
  }
 
});

module.exports = mongoose.model("volunteer",volunteerSchema);
