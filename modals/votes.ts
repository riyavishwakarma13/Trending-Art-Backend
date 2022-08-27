import { Schema, models, model } from "mongoose";
import posts from "./posts";
import * as yup from "yup";

export const votesValidationSchema = yup.object({
  postId: yup.string().required(),
  email: yup.string().required().email(),
  phone: yup.string().required(),
});

const Votes = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: posts.modelName,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.votes || model("votes", Votes);
