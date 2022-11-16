"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const posts_1 = __importDefault(require("./src/routes/posts"));
const votes_1 = __importDefault(require("./src/routes/votes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const limiter = (0, express_rate_limit_1.default)({
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
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/posts", posts_1.default);
app.use("/api/votes", limiter, votes_1.default);
app.get("/", (req, res) => {
    return res.send("WooW MeoW");
});
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})
    .catch((err) => {
    console.error(err);
});
