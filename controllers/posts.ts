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
    const res = await axios.post(
      "https://www.optiminastic.com/uploads/upload.php",
      fileD,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return "";
  }

  return `https://www.optiminastic.com/uploads/images/${filename}`;
};

const addPost: Handler = async (req, res) => {
  const body = req.body;
  // @ts-ignore
  const file: Express.Multer.File = req.file;

  if (!file) {
    return res.status(400).json({message: "File is required"});
  }


  try {
    await postsValidationSchema.validate(body, { abortEarly: false });

    const url = await uploadFileToFTP(file, body.phone);

    if (url?.length === 0) {
      return res.json({message: "Could not upload the post! Try again later"});
    }

    const doc = await posts.create({
      ...body,
      imageLink: url,
    });
    return res.json({
      message: `Post added Successfully`,
      data: {
        id: doc._id,
        name: doc.name,
        city: doc.city,
        category: doc.category,
        displayName: doc.displayName,
        imageLink: doc.imageLink,
        votes: doc.votes,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (error: any) {
    console.error(error);
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
  try {
    const query = req.query;
    // res.json(query);

    const start: number = parseInt(query.start as string) || 0;
    const searchObj: any = {};

    searchObj["deleted"] = false;

    const sortObj: any = {};

    if (query.sort === "time") {
      sortObj["createdAt"] = -1;
      searchObj["verified"] = true;
    } else {
      sortObj["votes"] = -1;
    }

    if (query.city) {
      searchObj["city"] = query.city;
    }

    if (query.category) {
      searchObj["category"] = query.category;
    }
    if (query.name) {
      searchObj["displayName"] = new RegExp(query.name as string, "i");
    }
    const docs = await posts
      .find(searchObj)
      .sort(sortObj)
      .skip(start)
      .limit(10);
    return res.json(
      docs.map((doc) => ({
        id: doc._id,
        name: doc.name,
        city: doc.city,
        category: doc.category,
        displayName: doc.displayName,
        imageLink: doc.imageLink,
        votes: doc.votes,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "something went wrong" });
  }
};
const getPostById: Handler = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.json({message: "Post Not Found"});
  }

  try {
    const doc = await posts.findOne({
      _id: id,
      deleted: false,
    });


    return res.json({
      id: doc._id,
      name: doc.name,
      city: doc.city,
      category: doc.category,
      displayName: doc.displayName,
      imageLink: doc.imageLink,
      votes: doc.votes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Post Not FOund" });
  }
};

const getPostCount: Handler = async (req, res) => {
  const { city } = req.query;

  const searchObj: any = {};

  if (city) {
    searchObj["city"] = city;
  }
  try {
    const count = await posts.countDocuments(searchObj);
    return res.status(200).json({ message: "Counts", data: count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error Fetching posts count" });
  }
};

const getPostByIdByNumber: Handler = async (req, res) => {
  const { number } = req.params;

  try {
    await numberValidationSchema.validate(number);
    const doc = await posts.findOne({
      phone: number,
      deleted: false,
    });

    return res.json({ message: "Post Id", data: doc.id });
  } catch (error) {
    console.error(error);
    if (error instanceof ValidationError) {
      return res.status(401).json({ message: "Not a valid number" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export { addPost, getPosts, getPostById, getPostCount, getPostByIdByNumber };
