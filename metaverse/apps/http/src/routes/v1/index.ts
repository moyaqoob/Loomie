import { Router } from "express";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { userRouter } from "./user";

export const router = Router()

router.post("/signup",(req,res)=>{
    res.json({
        message:"sign up"
    })
})

router.post("/signin",(req,res)=>{
    res.json({
        message:"sign in"
    })
}) 

router.get("/avatars",(req,res)=>{
    res.json({
        message:""
    })
})

router.use("/space",spaceRouter);
router.use("/admin",adminRouter);
router.use("/user",userRouter);
