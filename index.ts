import express, { Handler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRouter from "./src/routes/posts";
import votesRouter from "./src/routes/votes";
import RateLimit from "express-rate-limit";
import { over } from "./src/middleware/over";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI!;

const limiter = RateLimit({
  windowMs: 1000 * 60,
  max: 4,
  message: {
    message: "You Are Sending Too Many Requests, Try Again Later",
  },
});

// const blockList: any = {
//   "126.1.39.254": true,
//   "154.3.129.22": true,
//   "103.122.232.21": true,
//   "103.122.232.37": true,
//   "223.177.230.230": true,
//   "206.84.239.231": true,
// };

// const blockIp: Handler = (req, res, next) => {
//   const ipAddrs = req.headers["x-forwarded-for"] as string;
//   if (!ipAddrs) {
//     return res.status(401).json({ message: "Nice!" });
//   }
//   const list = ipAddrs.split(",");
//   const ip = list[list.length - 1];

//   if (blockList[ip]) {
//     // console.log("Blocked!", ip, req.body.postId);
//     return res.status(401).json({ message: "Nice!" });
//   }
//   next();
// };

app.use(express.json());
app.use(cors());
app.use("/api/posts", postRouter);
app.use("/api/votes", limiter, votesRouter);

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
