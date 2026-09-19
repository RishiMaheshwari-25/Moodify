const express=require("express");
const songRouter=express.Router()
const upload=require("../middleware/upload.middleware")
const songController=require("../controller/songController")
songRouter.post("/",upload.single("song"),songController.uploadSong)
songRouter.get("/",songController.getSong)



module.exports=songRouter;