import express from "express";
import cors from "cors"
import { router } from "./routes/v1";


const app = express();

app.use(cors());

app.use("/api/v1",router);

app.listen(3000);