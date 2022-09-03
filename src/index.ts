import express, { Handler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRouter from "../routes/posts";
import votesRouter from "../routes/votes";
import { verifyOtp } from "../controllers/verify-otp";
import { sendOtp } from "../controllers/send-otp";
import RateLimit from "express-rate-limit";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI!;

console.log(MONGODB_URI);

const limiter = RateLimit({
  windowMs: 1000 * 60,
  max: 3,
  message: {
    message: "You Are Sending Too Many Requests, Try Again Later",
  },
});

const blockList: any = { "126.1.39.254": true, "154.3.129.22": true };

const blockIp: Handler = (req, res, next) => {

  const ipAddrs = req.headers["x-forwarded-for"] as string;
  if (!ipAddrs) {
    return res.status(401).json({ message: "Nice!" });
  } 
  const list = ipAddrs.split(",");
  const ip = list[list.length-1];

  if (blockList[ip]) {
    console.log("Blocked!", ip, req.body);
    return res.status(401).json({ message: "Nice!" });
  }
  next();
};

app.use(express.json());
app.use(cors());
app.use("/api/posts", postRouter);
app.post("/api/verify-otp", verifyOtp);
app.post("/api/send-otp", sendOtp);
app.use("/api/votes", blockIp, limiter, votesRouter);

app.get("/", (req, res) => {
  return res.send("WooW MeoW");
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch((err) => {
    console.error(err);
  });
