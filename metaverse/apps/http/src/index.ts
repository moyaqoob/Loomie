import cors from "cors";
import express from "express";
import { router } from "./routes/v1";
import { FRONTEND_URL } from "./lib/config";
const app = express();

app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use(express.json());

app.use("/api/v1", router);

app.post("/",(req,res)=>{
    console.log("it is working")
})

app.listen(3002);
