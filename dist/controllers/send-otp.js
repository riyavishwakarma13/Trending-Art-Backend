"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
const yup_1 = require("yup");
const posts_1 = require("../modals/posts");
const users_1 = __importDefault(require("../modals/users"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.OTP_API_KEY;
    const number = req.body.phone;
    const doc = yield users_1.default.findOne({
        phone: number,
    });
    if (doc) {
        if (doc.verified)
            return res.status(201).json({ message: `Already Verified` });
        else if ((new Date().getTime() - new Date(doc.updatedAt).getTime()) / 1000 <
            60) {
            return res.status(401).json({ message: `Retry after Sometime` });
        }
    }
    try {
        yield posts_1.numberValidationSchema.validate(number);
        if (!doc) {
            yield users_1.default.create({
                phone: number,
            });
        }
        else {
            yield doc.updateOne({ verified: false });
        }
        yield axios_1.default.get(`https://2factor.in/API/V1/${apiKey}/SMS/+91${number}/AUTOGEN/OTP1`, {});
        return res.json({ message: "OTP sent to the phone number" });
    }
    catch (error) {
        console.error(error);
        if (error instanceof yup_1.ValidationError) {
            return res.status(400).json({ message: error.errors[0] });
        }
        else
            return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.sendOtp = sendOtp;
