"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyOtp = void 0;
const posts_1 = __importStar(require("../modals/posts"));
const users_1 = __importDefault(require("../modals/users"));
const yup_1 = require("yup");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.OTP_API_KEY;
    const number = req.body.phone;
    const otp = req.body.otp;
    // TODO: Check if already verified
    try {
        yield posts_1.numberValidationSchema.validate(number);
        const doc = yield posts_1.default.findOne({ phone: number });
        if (doc) {
            return res.status(402).json({ message: "Already Posted" });
        }
        const response = yield axios_1.default.get(`https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/91${number}/${otp}`);
        if (response.data.Details === "OTP Mismatch") {
            return res.status(401).json({ message: "OTP Mismatch" });
        }
        yield users_1.default.updateOne({
            phone: number,
        }, {
            $set: { verified: true },
        });
        return res.json({ message: "Verified" });
    }
    catch (error) {
        console.error(error);
        if (error instanceof yup_1.ValidationError) {
            return res.status(400).json({ message: error.errors[0] });
        }
        else {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
});
exports.verifyOtp = verifyOtp;
