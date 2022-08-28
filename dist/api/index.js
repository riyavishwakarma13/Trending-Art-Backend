"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const posts_1 = __importDefault(require("../routes/posts"));
const votes_1 = __importDefault(require("../routes/votes"));
const verify_otp_1 = require("../controllers/verify-otp");
const send_otp_1 = require("../controllers/send-otp");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/posts", posts_1.default);
app.post("/api/verify-otp", verify_otp_1.verifyOtp);
app.post("/api/send-otp", send_otp_1.sendOtp);
app.use("/api/votes", votes_1.default);
app.get("/", (req, res) => {
    res.send("WooW MeoW");
});
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})
    .catch((err) => {
    console.error(err);
});
