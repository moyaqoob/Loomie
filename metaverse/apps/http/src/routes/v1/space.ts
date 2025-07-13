import { Router } from "express";
import { AddElementSchema, CreateSpaceSchema } from "../../types";
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
   const width = parseInt(widthStr);
   const height = parseInt(heightStr);

   if(!parsedData.data?.mapId){
    const space = await client.space.create({
        data:{
            name,
            width,
            height,
            creatorId:req.userId as string,
        }
      })
       res.json({spaceId:space.id})
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

   let space = await client.$transaction(async()=>{
       const space = await client.space.create({
            data:{
                name:parsedData.data.name,
                width:width,
                height:height,
                creatorId:req.userId!,
            }
      });

      await client.spaceElements.createMany({
        data:map.mapElements.map(e=>({
            spaceId:space.id,
            elementId:e.elementId,
            x:parseInt(e.x!),
            y:parseInt(e.y!)
        }))
      })

      return space
   })

res.json({spaceId:space.id})
   



})

spaceRouter.delete("/:spaceId",userMiddleware,async(req,res)=>{
     const space = await client.space.findUnique({
        where:{
            id:req.params.spaceId
        },select:{
            creatorId:true
        }
     })   
     if(!space){
        res.status(400).json({message:"Space not found"});
        return;
     }

     if(space.creatorId !== req.userId){
        res.status(403).json({message:"Unauthorized"});
        return;
     }
     
     await client.space.delete({
        where:{
            id:req.params.spaceId
        }
     })
     res.json({message:"Space deleted Successfully"}).status(200)
     
})

spaceRouter.get("/all",userMiddleware,async(req,res)=>{
    const spaces = await client.space.findMany({
        where:{
            creatorId:req.userId!
        }
    })

    res.json({
        spaces:spaces.map(s=>({
            id:s.id,
            name:s.name,
            thumbnail:s.thumbnail, 
            dimension:`${s.width}x${s.height}`
        }))
    })
})

spaceRouter.get("/:spaceId",userMiddleware,async(req,res)=>{
    const spaces = await client.space.findFirst({
        where: {
            id: req.params.spaceId
        },
        select: {
            width: true,
            height: true,
            creatorId: true,
            elements: {
            select: {
                id: true,
                x: true,
                y: true,
                element: {
                select: {
                    id: true,
                    imageUrl: true,
                    static: true,
                    height: true,
                    width: true
                }
                }
            }
            }
        }
    });


    if(!spaces){
        res.status(400).json({message:"Space not found"})
    }

    if(spaces?.creatorId !== req.userId){
        res.json({message:"Unauthorized"}).status(403);
        return;
    }

    const dimensions = `${spaces?.width}x${spaces?.height}`

    const elements = spaces?.elements.map(e=>({
        id:e.id,
        element:e.element,
        x:e.x,
        y:e.y
    }))

    res.json({
        dimensions,
        elements
    })
})

spaceRouter.post("/element",userMiddleware,async(req,res)=>{
    const parsedData = AddElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({message:"Unauthorized"}).json(400);
        return;
    }

    const space = await client.space.findFirst({
        where:{
            id:req.body.spaceId,
            creatorId:req.userId
        },select:{
            width:true,
            height:true
        }
    })

    if(!space){
        res.status(400).json({message:"Space not found"})
    }

    await client.spaceElements.create({
        data:{
            elementId:req.body.spaceId,
            spaceId:req.body.elementId,
            x:req.body.x,
            y:req.body.y
        }
    })

    res.json({message:"Element added"})

})

spaceRouter.delete("/element",userMiddleware,async(req,res)=>{
    const element = await client.spaceElements.findFirst({
        where:{
            id:req.params.element
        },select:{
            elementId:true
        }
    })

    if(!element?.elementId){
        res.json({message:"Cannot find the element"}).status(400)
    }
    
    await client.space.delete({
        where:{
            id:element?.elementId
        }
    })

    res.json({message:"Element deleted Successfully"}).status(200)
})


spaceRouter.get("/elements", async (req, res) => {
    try{
        const elements = await client.element.findMany({
          where:{
              id:req.userId,
          },
          select: {
            id: true,
            imageUrl: true,
            width: true,
            height: true,
            static: true
          }
        });
      
      
        res.json({ elements });
    }catch(e){
        console.error("Failed to fetch the elements")
        res.status(403).json({message:"Internal server error"});
    }
});
