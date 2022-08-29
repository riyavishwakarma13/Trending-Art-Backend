import { Router } from "express";
import { addPost, getPostById, getPosts } from "../controllers/posts";
import path from "path";
import multer from "multer";
const postRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5000000,
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  },
});

postRouter.post("/", upload.single("file"), addPost);
postRouter.get("/", getPosts);
postRouter.get("/:id", getPostById);

export default postRouter;
