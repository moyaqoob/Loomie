import { Router } from "express";
import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
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
            x:(e.x!),
            y:(e.y!)
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
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        },
        include: {
            elements:{
                include:{
                    element:true
                }
            }
        }
    });


    if(!space){
        res.status(400).json({message:"Space not found"})
    }


    res.json({
        "dimensions":`${space?.width}x${space?.height}`,
        elements:space?.elements.map(e=>({
            id:e.id,
            element:{
                id:e.element.id,
                imageUrl:e.element.imageUrl,
                width:e.element.width,
                height:e.element.height,
                static:e.element.static
            },
            x:e.x,
            y:e.y
        }))
    })
})

spaceRouter.post("/element",userMiddleware,async(req,res)=>{
    const parsedData = AddElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({message:"Unauthorized"}).json(400);
        return;
    }

    const space = await client.space.findUnique({
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

    const element = await client.spaceElements.create({
        data:{
            spaceId:req.body.spaceId,
            elementId:req.body.elementId,
            x:req.body.x,
            y:req.body.y
        }
    })

    res.json({message:"Element added"})

})

spaceRouter.delete("/element", userMiddleware, async(req,res)=>{
    const parsedData = DeleteElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.status(400).json({message:"Validation Failed"})
    }
    const spaceElement = await client.spaceElements.findUnique({
        where:{
            id:parsedData.data?.id,

        },include:{
            space:true
        }
    })

    if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId){
        res.json({message:"Cannot find the element"}).status(403)
        return
    }
    
    await client.spaceElements.delete({
        where:{
            id:req.body.id
        }
    })

    res.json({message:"Element deleted "}).status(200)
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
