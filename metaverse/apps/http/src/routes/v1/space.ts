import client from "@repo/db/client";
import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import {
  AddElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../../types";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  const parsedData = CreateSpaceSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  const { name, dimensions, mapId } = parsedData.data;
  const [widthStr, heightStr] = dimensions.split("x");
  const width = parseInt(widthStr);
  const height = parseInt(heightStr);

  // If no mapId, create space directly
  if (!parsedData.data.mapId) {
    const space = await client.space.create({
      data: {
        name,
        width,
        height,
        creatorId: req.userId!,
      },
    });
     res.json({ spaceId: space.id });
     return;
  }

  // Validate and fetch map
  const map = await client.map.findUnique({
    where: { id: mapId },
    select: { mapElements: true },
  });

  if (!map) {
     res.status(400).json({ message: "Map not found" });
     return;
  }

  // Create space + elements transactionally
  const createdSpace = await client.$transaction(async (tx:any) => {
    const space = await tx.space.create({
      data: {
        name,
        width,
        height,
        creatorId: req.userId!,
      },
    });

    await tx.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        spaceId: space.id,
        elementId: e.elementId,
        x: e.x!,
        y: e.y!,
      })),
    });

    return space;
  });

   res.status(200).json({ spaceId: createdSpace.id });
});


spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    select: {
      creatorId: true,
    },
  });
  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }

  if (space.creatorId !== req.userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  await client.space.delete({
    where: {
      id: req.params.spaceId,
    },
  });
  res.status(200).json({ message: "Space deleted Successfully" });
});

spaceRouter.get("/all", userMiddleware, async (req, res) => {
  const spaces = await client.space.findMany({
    where: {
      creatorId: req.userId!,
    },
  });
  console.log("all elements",spaces.length)
  res.json({
    spaces: spaces.map((s:any) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail,
      dimension: `${s.width}x${s.height}`,
    })),
  });
});

spaceRouter.get("/:spaceId", userMiddleware, async (req, res) => {
  const space = await client.space.findFirst({
    where: {
      id: req.params.spaceId,
    },
    include: {
      elements: {
        include: {
          element: true,
        },
      },
    },
  });
  console.log("get space element",space?.elements)

  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }

  res.status(200).json({
    dimensions: `${space?.width}x${space?.height}`,
    elements: space?.elements.map((e:any) => ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static,
      },
      x: e.x,
      y: e.y,
    })),
  });
});

spaceRouter.post("/element", userMiddleware, async (req, res) => {
  const parsedData = AddElementSchema.safeParse(req.body);
    console.log("space element",parsedData.data)
  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const { spaceId, elementId, x, y } = parsedData.data;

  const space = await client.space.findUnique({
    where: {
      id: spaceId,
      creatorId: req.userId,
    },
    select: {
      width: true,
      height: true,
    },
  });
  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }
  console.log("x",x,"y",y,"space widhth and height",space.width,space.height)

  if (x >= space.width || y >= space.height || x < 0 || y < 0) {
    res.status(400).json({ message: "Coordinates out of bounds" });
    return;
  }

  console.log("here passed the check")

  const element = await client.spaceElements.create({
    data: {
      spaceId,
      elementId,
      x,
      y,
    },
  });

  res.status(200).json({ id: element.id });
});

spaceRouter.delete("/element", userMiddleware, async (req, res) => {
  const parsedData = DeleteElementSchema.safeParse(req.body);
  console.log("space delete",parsedData.data)

  if (!parsedData.success) {
     res.status(400).json({ message: "Validation Failed" });
     return;
  }

  const spaceElement = await client.spaceElements.findUnique({
    where: {
      id: parsedData.data.id,
    },
    include: {
      space: true,
    },
  });

  if (
    !spaceElement?.space.creatorId ||
    spaceElement.space.creatorId !== req.userId
  ) {
     res.status(403).json({ message: "Cannot find the element" });
     return;
  }

  await client.spaceElements.delete({
    where: {
      id: parsedData.data.id,
    },
  });

  res.status(200).json({ message: "Element deleted" }); // ✅ FIXED
});


spaceRouter.get("/elements", async (req, res) => {
  try {
    const elements = await client.element.findMany({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        imageUrl: true,
        width: true,
        height: true,
        static: true,
      },
    });

    res.json({ elements });
  } catch (e) {
    console.error("Failed to fetch the elements");
    res.status(403).json({ message: "Internal server error" });
  }
});
