const mongoose=require("mongoose");
function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to Db")
    }).catch((err)=>{
        console.log("Error Connecting to Db",err)
    })
   
}
module.exports=connectToDb;