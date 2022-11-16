import { Schema, models, model } from "mongoose";
import posts from "./posts";
import * as yup from "yup";

export const votesValidationSchema = yup.object({
  postId: yup.string().required(),
  email: yup.string().required().email(),
  phone: yup.string().required().trim()
  .matches(/^[6-9]{1}[0-9]{9}$/, "Invalid Phone Number"),
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
