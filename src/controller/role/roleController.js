const Role = require("../../models/role")
const roleController = ({
  register:async(req,res)=>{
    try {
        const {name} = req.body;
        if(!name){
            return res.status(400).json({message:"missing required fields"})
        }
        const role = await Role.findOne({name});
        if(role){
            return res.status(404).json({message:"role already exist"})
        }
        const newRole = await Role({
            name
        })
        await newRole.save();
        res.status(201).json({message:"role created successfully",newRole})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
  }
})

module.exports = roleController;