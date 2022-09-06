import { Handler } from "express";
import posts from "../modals/posts";
import { ValidationError } from "yup";
import dotenv from "dotenv";
import votes, { votesValidationSchema } from "../modals/votes";
import axios from "axios";

dotenv.config();

const isHuman = async (token:string|undefined) => { 
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  );
  return response.data.success
}

const addVote: Handler = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  console.log(req.body)
  try {
    await votesValidationSchema.validate(body, { abortEarly: false });

    if (!await isHuman(req.body.token)) {
      return res.status(401).json({ message: "Verification Failed!" });
    }
    
    const post = await posts.findOne({ _id: id, deleted: false });
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    if (post.phone === body.phone) {
      return res.status(400).json({ message: "Cannot vote to yourself" });
    }

    const alreadyVoted = await votes.findOne({
      postId: id,
      email: body.email,
    });

    if (alreadyVoted) {
      console.log("Caught you", req.body);
      return res.status(404).json({ message: "Already Voted" });
    }

    await votes.create({
      postId: id,
      email: body.email,
      phone: body.phone,
    });
    await posts.findByIdAndUpdate(id, {
      $inc: {
        votes: 1,
      },
    });
    return res.json({ message: "Vote Added Successfully" });
  } catch (error: any) {
    console.error(error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.errors[0] });
    } else if (error?.message.includes("duplicate")) {
      return res.status(401).json({ message: "Already Voted" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export { addVote };
