const userModel=require("../models/user.models")
const jwt=require("jsonwebtoken");
const blacklistModel=require("../models/blacklist.model")
const redis=require("../config/cache")
async function identifyUser(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Token not provided",

        })
    }
    const isTokenBlackListed=await redis.get(token)
    if(isTokenBlackListed){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded;
        next()
    }catch(err){
        return res.status(404).json({
            message:"Invalid Token"
        })
    }
}
module.exports={identifyUser}