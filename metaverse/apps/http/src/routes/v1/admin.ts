import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";


export const adminRouter = Router();

adminRouter.post("/element",adminMiddleware,(req,res)=>{

})

adminRouter.put("/element/:elementId",adminMiddleware,(req,res)=>{

})

adminRouter.post("/avatar",adminMiddleware,(req,res)=>{

})

adminRouter.get("/map",adminMiddleware,(req,res)=>{

})