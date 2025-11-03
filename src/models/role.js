const  mongoose  = require("mongoose");

const roleSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
        enum:["Police","Admin"]
    },
}, {
        timeStamp:true
    })

module.exports = mongoose.model("role",roleSchema);