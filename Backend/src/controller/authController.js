const userModel=require("../models/user.models")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const blacklistModel=require("../models/blacklist.model")
async function registerController(req,res){
    const {username,email,password}=req.body;
    const isUserAlreadyExists=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already Exists"
        })
    }
    const hash=await bcrypt.hash(password,10);
    const user=await userModel.create({
        username,email,password:hash
    })
    const token=jwt.sign({
        id:user._id,
        username:user.username,
    

    },process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token)
    res.status(201).json({
        message:"User registere Successfully",
        user:{
            username:user.username,
            email:user.email,
            password:user.password
        }
    })
}
async function loginController(req,res){
    const {username,email,password}=req.body
    const user=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    }).select("+password")
    if(!user){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password) 
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }
    const token=jwt.sign({
        id:user._id,
        username:user.username,
    
        
    },process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token)
    res.status(200).json({
        message:"User logged in Successfully",
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }

    })
}
async function getMeController(req,res){
    const user=await userModel.findById(req.user.id)
    res.status(200).json({
        message:"User Fetched Successfully",
        user
    })
}
async function logoutController(req,res){
    const token=req.cookies.token;
    res.clearCookie("token");
    await blacklistModel.create({
        token
    })
    res.status(201).json({
        message:"Logout Successfully"
    })
}
module.exports={
    registerController,
    loginController,
    getMeController,
    logoutController
}