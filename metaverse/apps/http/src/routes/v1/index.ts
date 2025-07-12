import client from "@repo/db/client";
import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../../config";
import { SigninSchema, SignupSchema } from "../../types";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { userRouter } from "./user";
import { userMiddleware } from "../../middleware/user";

export const router = Router();


router.post("/signup", async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Validation Failed" });
    return;
  }
  const hashPassword = await bcrypt.hash(parsedData.data.password, 10);
  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashPassword,

        role: parsedData.data?.type === "admin" ? "admin" : "user",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(403).json({ message: "User already exists" });
    return;
  }
});

router.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(404).json({
      message: "Validation failed",
    });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    if(user){
        res.status(202)
    }
    const isValid = await bcrypt.compare(
      parsedData.data.password,
      user.password
    );
    if (!isValid) {
       res.status(403).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_PASSWORD
    );

    res.status(200).json({
        token
    })
  } catch (e) {
    res.json("Sign In Failed").status(400);
  }
});

router.get("/avatars",userMiddleware, (req, res) => {
  console.log("user middleware working")
  res.json({
    message: "avatar",
  });
});

router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);
