import path from "path";
import crypto from "crypto";
import { Handler } from "express";
import posts, {
  numberValidationSchema,
  postsValidationSchema,
} from "../modals/posts";
import { ValidationError } from "yup";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const uploadFileToFTP = async (
  file: Express.Multer.File,
  phone: string
): Promise<string> => {
  const ext = path.extname(file.originalname).toLowerCase();
  const name =
    crypto.createHash("md5").update(phone).digest().toString("hex") +
    Date.now();

  const base64Image = Buffer.from(file.buffer).toString("base64url");
  const filename = `${name}${ext}`;
  const fileD = `name=${filename}&file=${base64Image}`;

  try {
    const res = axios.post(
      "https://www.optiminastic.com/uploads/upload.php",
      fileD,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch (error) {}

  return `https://www.optiminastic.com/uploads/images/${filename}`;
};

const addPost: Handler = async (req, res) => {
  const body = req.body;
  // @ts-ignore
  const file: Express.Multer.File = req.file;

  try {
    await postsValidationSchema.validate(body, { abortEarly: false });

    const url = await uploadFileToFTP(file, body.phone);

    await posts.create({
      ...body,
      imageLink: url,
    });
    return res.json({ message: `${url}` });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.errors[0] });
    } else if (error?.message.includes("duplicate")) {
      return res.status(401).json({ message: "Post Already Exists" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};

const getPosts: Handler = async (req, res) => {
  const query = req.query;
  // res.json(query);

  const start: number = parseInt(query.start as string) || 0;
  const searchObj: any = {};

  searchObj["deleted"] = false;

  const sortObj: any = {};

  if (query.sort === "time") {
    sortObj["createdAt"] = -1;
  } else {
    sortObj["votes"] = -1;
  }

  if (query.city) {
    searchObj["city"] = query.city;
  }

  if (query.cat) {
    searchObj["Category"] = query.cat;
  }
  if (query.name) {
    searchObj["displayName"] = new RegExp(query.name as string, "i");
  }

  return res.json(
    await posts.find(searchObj).sort(sortObj).skip(start).limit(10)
  );
};

const getPostByNumber: Handler = async (req, res) => {
  const { number } = req.params;

  try {
    await numberValidationSchema.validate(number);
    const doc = await posts.findOne({
      phone: number,
      deleted: false,
    });

    return res.json(doc);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(401).json({ message: "Not a valid number" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  return res.json({ message: "Hello World" });
};

export { addPost, getPosts, getPostByNumber };
