declare global {
  namespace Express {
    export interface Request {
      role:["admin","user"];
      userId?: string;
    }
  }
}



import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../../config"
import type { NextFunction, Request, Response } from "express"


export const adminMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];

    if(!token){
        res.status(401).json({message:"Unauthorized"})
        return;
    }

    try{
        const decoded = jwt.verify(token,JWT_PASSWORD) as {role:string,userId:string};

        if(decoded.role !=="admin"){
          res.status(403).json({message:"Unauthorized"});
          return;
        }
        req.userId = decoded.userId;
        next();
    }catch(e){
        res.status(401).json({message:"Unauthorized"})
    }
}