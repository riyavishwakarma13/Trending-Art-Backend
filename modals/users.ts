import { Schema, models, model } from "mongoose";

const Users = new Schema(
  {
    phone: {
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
