import cors from "cors";
import express from "express";
import { router } from "./routes/v1";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.post("/",(req,res)=>{
    console.log("it is working")
})

app.listen(3000);
