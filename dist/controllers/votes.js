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
exports.addVote = void 0;
const posts_1 = __importDefault(require("../modals/posts"));
const yup_1 = require("yup");
const dotenv_1 = __importDefault(require("dotenv"));
const votes_1 = __importStar(require("../modals/votes"));
dotenv_1.default.config();
const addVote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield votes_1.votesValidationSchema.validate(body, { abortEarly: false });
        const post = yield posts_1.default.findById(body.postId);
        if (!post) {
            return res.status(400).json({ message: "post not found" });
        }
        yield votes_1.default.create({
            postId: body.postId,
            email: body.email,
            phone: body.phone,
        });
        yield posts_1.default.findByIdAndUpdate(body.postId, {
            $inc: {
                votes: 1,
            },
        });
        return res.json({ message: "Vote Added Successfully" });
    }
    catch (error) {
        console.log(error);
        if (error instanceof yup_1.ValidationError) {
            return res.status(400).json({ message: error.errors[0] });
        }
        else if (error === null || error === void 0 ? void 0 : error.message.includes("duplicate")) {
            return res.status(401).json({ message: "Already Voted" });
        }
        else {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
});
exports.addVote = addVote;
