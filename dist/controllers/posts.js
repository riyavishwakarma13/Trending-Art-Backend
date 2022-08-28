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
exports.getPostByNumber = exports.getPosts = exports.addPost = void 0;
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const posts_1 = __importStar(require("../modals/posts"));
const yup_1 = require("yup");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uploadFileToFTP = (file, phone) => __awaiter(void 0, void 0, void 0, function* () {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const name = crypto_1.default.createHash("md5").update(phone).digest().toString("hex") +
        Date.now();
    const base64Image = Buffer.from(file.buffer).toString("base64url");
    const filename = `${name}${ext}`;
    const fileD = `name=${filename}&file=${base64Image}`;
    try {
        const res = axios_1.default.post("https://www.optiminastic.com/uploads/upload.php", fileD, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    }
    catch (error) { }
    return `https://www.optiminastic.com/uploads/images/${filename}`;
});
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // @ts-ignore
    const file = req.file;
    try {
        yield posts_1.postsValidationSchema.validate(body, { abortEarly: false });
        const url = yield uploadFileToFTP(file, body.phone);
        yield posts_1.default.create(Object.assign(Object.assign({}, body), { imageLink: url }));
        return res.json({ message: `${url}` });
    }
    catch (error) {
        if (error instanceof yup_1.ValidationError) {
            return res.status(400).json({ message: error.errors[0] });
        }
        else if (error === null || error === void 0 ? void 0 : error.message.includes("duplicate")) {
            return res.status(401).json({ message: "Post Already Exists" });
        }
        else {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
});
exports.addPost = addPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    // res.json(query);
    const start = parseInt(query.start) || 0;
    const searchObj = {};
    searchObj["deleted"] = false;
    if (query.city) {
        searchObj["city"] = query.city;
    }
    if (query.cat) {
        searchObj["Category"] = query.cat;
    }
    if (query.name) {
        searchObj["name"] = new RegExp(query.name, "i");
    }
    return res.json(yield posts_1.default.find(searchObj).sort({ votes: -1 }).skip(start).limit(10));
});
exports.getPosts = getPosts;
const getPostByNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number } = req.params;
    try {
        yield posts_1.numberValidationSchema.validate(number);
        const doc = yield posts_1.default.findOne({
            phone: number,
            deleted: false,
        });
        return res.json(doc);
    }
    catch (error) {
        if (error instanceof yup_1.ValidationError) {
            return res.status(401).json({ message: "Not a valid number" });
        }
        else {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
    return res.json({ message: "Hello World" });
});
exports.getPostByNumber = getPostByNumber;
