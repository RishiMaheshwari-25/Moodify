const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"This Username is already exists "],
        required:[true,"Username is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"]

    },
    password:{
        type:String,
       required:[true,"password is required"],
       unique:[true,"email should be unique"],
       select:false
    }
})
const userModel=mongoose.model("users",userSchema)

// userSchema.pre("save",function(next){});
// userSchema.post("save",function(next{}))
module.exports=userModel