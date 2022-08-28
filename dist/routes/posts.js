"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_1 = require("../controllers/posts");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const postRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5000000,
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        // Check ext
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Error: Images Only!"));
        }
    },
});
postRouter.post("/", upload.single("file"), posts_1.addPost);
postRouter.get("/", posts_1.getPosts);
postRouter.get("/:number", posts_1.getPostByNumber);
exports.default = postRouter;
