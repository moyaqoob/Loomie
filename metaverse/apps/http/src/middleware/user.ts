
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../../config"
import type { NextFunction, Request, Response } from "express"


export const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    console.log("token",token)
    if(!token){
        res.status(401).json({message:"Unauthorized"})
        return;
    }

    try{
        const decoded = jwt.verify(token,JWT_PASSWORD) as {role:string,userId:string};
        
        if(decoded.role !=="admin"){
          res.json({message:"Unauthorized"}).status(403);
          return;
        }
        req.userId = decoded.userId;
        next()

        
    }catch(e){
        res.status(401).json({message:"Unauthorized"})
    }
}