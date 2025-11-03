const User = require("../../models/user")
const Role = require("../../models/role")
const JWT = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()
const userController = ({
  register:async(req,res)=>{
    try {
        const {name,phone,roleId} = req.body;
        const role = await Role.findOne({_id:roleId})
         if(!role){
            return res.status(404).json({message:"role not found"})
        }
        if(!name || !phone ||!roleId){
            return res.status(400).json({message:"missing required fields"})
        }
        const user = await User.findOne({phone});
        if(user){
            return res.status(404).json({message:"phone number already exist"})
        }
        const newUser = await User({
            name,
            phone,
            roleId
        })
        await newUser.save();
        res.status(201).json({message:"user created successfully",newUser})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
  },
  login:async(req,res)=>{
    try {
        const {name,phone} = req.body;
        if(!name || !phone){
            return res.status(400).json({message:"missing required fields"})
        }
        const user = await User.findOne({phone}).populate("roleId")
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        if(!user.roleId || !user.roleId.name === "name"){
            return res.status(400).json({message:"access denied. only admins can login"})
        }
        const token = JWT.sign(
            {id:user._id,name:user.name,phone:user.phone,roleId:user.roleId},
            process.env.SECRET_KEY,
            {expiresIn:"1d"}
        )
        res.status(200).json({message:"login successfully",user,token})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
  }
})

module.exports = userController;