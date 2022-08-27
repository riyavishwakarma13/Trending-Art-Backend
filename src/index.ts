import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRouter from "../routes/posts";
import votesRouter from "../routes/votes";
import { verifyOtp } from "../controllers/verify-otp";
import { sendOtp } from "../controllers/send-otp";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI!;

console.log(MONGODB_URI);

app.use(express.json());
app.use(cors());
app.use("/api/posts", postRouter);
app.post("/api/verify-otp", verifyOtp);
app.post("/api/send-otp", sendOtp);
app.use("/api/votes", votesRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("WooW MeoW");
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch((err) => {
    console.error(err);
  });
