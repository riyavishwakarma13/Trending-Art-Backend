import { Handler } from "express";
import posts from "../modals/posts";
import { ValidationError } from "yup";
import dotenv from "dotenv";
import votes, { votesValidationSchema } from "../modals/votes";

dotenv.config();
const addVote: Handler = async (req, res) => {
  const body = req.body;
  try {
    await votesValidationSchema.validate(body, { abortEarly: false });
    const post = await posts.findById(body.postId);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    if (post.phone === body.phone) {
      return res.status(400).json({ message: "Cannot vote to yourself" });
    }

    const alreadyVoted = await votes.findOne({
      postId: body.postId,
    });

    if (alreadyVoted.email === body?.email || alreadyVoted.phone === body?.phone) {
      console.log("Caught you", req.body);
      return res.status(404).json({ message: "Already Voted" });
    }

    await votes.create({
      postId: body.postId,
      email: body.email,
      phone: body.phone,
    });
    await posts.findByIdAndUpdate(body.postId, {
      $inc: {
        votes: 1,
      },
    });
    return res.json({ message: "Vote Added Successfully" });
  } catch (error: any) {
    console.log(error);
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
