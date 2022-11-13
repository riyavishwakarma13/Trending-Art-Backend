import { Schema, models, model } from "mongoose";

const Users = new Schema(
  {
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.users ||
  model("users", Users);
