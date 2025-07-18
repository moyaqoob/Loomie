import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types";
import client from "@repo/db/client";


export const adminRouter = Router();

adminRouter.post("/element",adminMiddleware,async(req,res)=>{
    const parsedData = CreateElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({message:"Cannot parse the Element"})
        return;
    }

    const element = await client.element.create({
        data:{
            imageUrl:parsedData.data.imageUrl,
            width:parsedData.data.width,
            height:parsedData.data.height,
            static:parsedData.data.static
        }
    })

    res.json({id:element.id})
})

adminRouter.put("/element/:elementId",adminMiddleware,(req,res)=>{
    const parsedData = UpdateElementSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({message:"Cannot update the element"}).status(400)
        return;
    }

    client.element.update({
        where:{
            id:req.params.id
        },data:{
           imageUrl:parsedData.data.imageUrl 
        }
    })
    res.json({message:"Element Updated"})
})

adminRouter.post("/avatar",adminMiddleware,async(req,res)=>{
    const parsedData = CreateAvatarSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({message:"Cant parsed the Avatar"})
        return;
    }

    const avatar = await client.avatar.create({
        data:{
            name:parsedData.data.name,
            imageUrl:parsedData.data.imageUrl
        }
    })

    res.status(200).json({
        avatarId:avatar.id
    })
})


adminRouter.post("/map",adminMiddleware,async(req,res)=>{
    const parsedData = CreateMapSchema.safeParse(req.body);
    
    if(!parsedData.success){
        res.json({message:"Cannot parse the Map"})
        return;
    }
    
    const map = await client.map.create({
        data:{
            name:parsedData.data?.name,
            width:parseInt(parsedData.data.dimensions.split("x")[0]),
            height:parseInt(parsedData.data.dimensions.split("x")[1]),
            thumbnail:parsedData.data?.thumbnail,
            mapElements:{
                create:parsedData.data.defaultElements.map(e=>({
                    elementId:e.elementId,
                    x:e.x,
                    y:e.y
                }))
            }
        }
    })

    res.json({
        mapId:map.id
    })

    

})