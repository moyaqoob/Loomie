import client from "@repo/db/client";
import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { UpdateMetadataSchema } from "../../types";

export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async (req, res) => {
  const parsedData = UpdateMetadataSchema.safeParse(req.body);
  console.log("avatar data",parsedData.data)
  if (!parsedData.success) {
     res.status(400).json({ message: "Validation Failed" });
  }

  const avatar = await client.avatar.findFirst({
    where: { id: parsedData.data?.avatarId },
  });

  if (!avatar) {
     res.status(404).json({ message: "failed to create avatar" });
  }

  console.log("metadata endpoint", parsedData);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation Failed" });
    return;
  }

  await client.user.update({
    where: {
      id: req.userId!,
    },
    data: {
      avatarId: avatar?.id,
    },
  });

  res.status(200).json({ message: "Metadata updated" });
});

userRouter.get("/metadata/bulk", async (req, res) => {
  const parsedData = (req.query.ids ?? "[]") as string;
  const userIds = parsedData.slice(1, parsedData?.length - 2).split(",");
  console.log("metadata parsedIds",userIds)
  const metadata = await client.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      avatar: true,
      id: true,
    },
  });

  res.json({
    avatars: metadata.map((m) => ({
      userId: m.id,
      avatarId: m.avatar?.imageUrl,
    })),
  });
});
