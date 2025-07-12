import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import { userMiddleware } from "../../middleware/user";
import client from "@repo/db/client";

export const userRouter = Router();

userRouter.post("/metadata",userMiddleware ,async(req, res) => {
  const parsedData = UpdateMetadataSchema.safeParse(req.body);

  const avatar = await client.avatar.findUnique({where:{
    id:parsedData.data?.avatarId
  }})

  if(!avatar){
    throw new Error("Avatar not found")
  }

  console.log('metadata endpoint',parsedData)
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation Failed" });
    return;
  }

  await client.user.update({
    where:{
        id:req.userId
    },
    data:{
        avatarId:parsedData.data.avatarId
    }
  })

  res.json({message:"Metadata updated"})
  
});

userRouter.get("/metadata/bulk",async (req, res) => {
    const parsedData = (req.query.ids ?? "[]") as string;
    const userIds = (parsedData).slice(1,parsedData?.length-2).split(",");
    
    const metadata = await client.user.findMany({
        where:{
            id:{
                in:userIds
            }
        },select:{
            avatar:true,
            id:true
        }
    })

    res.json({
        avatars:(metadata).map(m=>({
            userId:m.id,
            avatarId:m.avatar?.imageUrl
        }))
    })
});
