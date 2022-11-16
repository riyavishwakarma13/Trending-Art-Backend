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
exports.getPostByIdByNumber = exports.getPostCount = exports.getPostById = exports.getPosts = exports.addPost = void 0;
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const posts_1 = __importStar(require("../modals/posts"));
const yup_1 = require("yup");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = require("../firebase-admin");
dotenv_1.default.config();
const uploadFileToFTP = (file, phone) => __awaiter(void 0, void 0, void 0, function* () {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const name = crypto_1.default.createHash("md5").update(phone).digest().toString("hex") +
        Date.now();
    const base64Image = Buffer.from(file.buffer).toString("base64url");
    const filename = `${name}${ext}`;
    const fileD = `name=${filename}&file=${base64Image}`;
    try {
        const res = yield axios_1.default.post("https://www.optiminastic.com/uploads/upload.php", fileD, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        // if (!res.data.startsWith("WooW")) {
        //   return "";
        // }
    }
    catch (error) {
        console.error(error);
        return "";
    }
    return `https://www.optiminastic.com/uploads/images/${filename}`;
});
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // @ts-ignore
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "File is required" });
    }
    try {
        yield posts_1.postsValidationSchema.validate(body, { abortEarly: false });
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const name = crypto_1.default.createHash("md5").update(body.contact).digest().toString("hex") +
            Date.now();
        const fileName = `${name}${ext}`;
        const uploadFile = (name, file) => __awaiter(void 0, void 0, void 0, function* () {
            // const fileName = createFileName(name, file.originalname);
            const filePath = `posts/${name}`;
            const fileObj = firebase_admin_1.postBucket.file(filePath);
            const postLink = yield fileObj.save(file.buffer, {
                public: true,
            });
            return fileObj.publicUrl();
        });
        const url = yield uploadFile(fileName, file);
        if ((url === null || url === void 0 ? void 0 : url.length) === 0) {
            return res.json({
                message: "Could not upload the post! Try again later",
            });
        }
        const doc = yield posts_1.default.create(Object.assign(Object.assign({}, body), { imageLink: url }));
        return res.json({
            message: `Post added Successfully`,
            data: {
                id: doc._id,
                name: doc.name,
                country: doc.country,
                displayName: doc.displayName,
                imageLink: doc.imageLink,
                votes: doc.votes,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            },
        });
    }
    catch (error) {
        console.error(error);
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
    try {
        const query = req.query;
        // res.json(query);
        const start = parseInt(query.start) || 0;
        const searchObj = {};
        searchObj["deleted"] = false;
        const sortObj = {};
        if (query.sort === "time") {
            sortObj["createdAt"] = -1;
        }
        else {
            sortObj["votes"] = -1;
        }
        if (query.country) {
            searchObj["country"] = query.country;
        }
        if (query.name) {
            searchObj["displayName"] = new RegExp(query.name, "i");
        }
        const docs = yield posts_1.default
            .find(searchObj)
            .sort(sortObj)
            .skip(start)
            .limit(10);
        return res.json(docs.map((doc) => ({
            id: doc._id,
            name: doc.name,
            country: doc.country,
            displayName: doc.displayName,
            imageLink: doc.imageLink,
            votes: doc.votes,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        })));
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "something went wrong" });
    }
});
exports.getPosts = getPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.json({ message: "Post Not Found" });
    }
    try {
        const doc = yield posts_1.default.findOne({
            _id: id,
            deleted: false,
        });
        return res.json({
            id: doc._id,
            name: doc.name,
            country: doc.country,
            displayName: doc.displayName,
            imageLink: doc.imageLink,
            votes: doc.votes,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Post Not FOund" });
    }
});
exports.getPostById = getPostById;
const getPostCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { city } = req.query;
    const searchObj = {};
    if (city) {
        searchObj["city"] = city;
    }
    try {
        const count = yield posts_1.default.countDocuments(searchObj);
        return res.status(200).json({ message: "Counts", data: count });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error Fetching posts count" });
    }
});
exports.getPostCount = getPostCount;
const getPostByIdByNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number } = req.params;
    try {
        yield posts_1.numberValidationSchema.validate(number);
        const doc = yield posts_1.default.findOne({
            contact: number,
            deleted: false,
        });
        return res.json({ message: "Post Id", data: doc.id });
    }
    catch (error) {
        console.error(error);
        if (error instanceof yup_1.ValidationError) {
            return res.status(401).json({ message: "Not a valid number" });
        }
        else {
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
});
exports.getPostByIdByNumber = getPostByIdByNumber;
