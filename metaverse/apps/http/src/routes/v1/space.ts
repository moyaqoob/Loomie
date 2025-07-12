import { Router } from "express";
import { CreateSpaceSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const spaceRouter = Router();

spaceRouter.post("/",userMiddleware, async(req,res)=>{
   const parsedData = CreateSpaceSchema.safeParse(req.body);

   if(!parsedData.success){
        res.status(400).json({message:"Validation failed"})
        return;
   }
   const {name,dimensions,mapId} = parsedData.data;

   const [widthStr, heightStr] = dimensions.split("x");
   const width = Number(widthStr);
   const height = Number(heightStr);

   if(!parsedData.data?.mapId){
     await client.space.create({
        data:{
            name,
            width,
            height,
            creatorId:req.userId as string,
        }
      })
       res.json({message:"Space created"})
   }
   const map = await client.map.findUnique({
        where:{
            id:mapId
        },select:{
            mapElements:true
        }
   })
   if(!map){
        res.status(400).json({message:"Map not found"})
        return;
   }

   await client.space.create({
    data:{
        name:parsedData.data.name,
        width:parsedData.data.dimensions.split("x")[0],
        height:parsedData.data.dimensions.split("x")[1],
        creatorId:req.userId,
        elements:{
            create:map.mapElements.map(e=>({
                elementId
            }))
        }
    }
   })
   



})

spaceRouter.delete("/:spaceId",(req,res)=>{

})

spaceRouter.get("/all",(req,res)=>{

})

spaceRouter.get("/:spaceId",(req,res)=>{

})

spaceRouter.post("/element",(req,res)=>{

})

spaceRouter.delete("/element",(req,res)=>{

})


spaceRouter.get("elements",(req,res)=>{
    
})