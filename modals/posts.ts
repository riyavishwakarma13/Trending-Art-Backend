import { Schema, models, model } from "mongoose";
import * as yup from "yup";

const cities = [
  "THANE",
  "NAVI MUMBAI",
  "MUMBAI",
  "PUNE",
  "AMRAVATI",
  "NAGPUR",
  "AKOLA",
  "JALGAON",
  "KOLHAPUR",
  "CHANDRAPUR",
  "WASHIM",
  "SANGLI",
  "HINGOLI",
  "GHADCHIROLI",
  "AMRAVATI",
  "LATUR",
  "PALGHAR",
  "AURANGABAD",
  "GOA",
  "NANDED",
  "OTHERS",
];

const categories = ["HOUSEHOLD", "SOCIETY", "MANDAL"];

export const postsValidationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email(),
  phone: yup.string().required(),
  city: yup
    .string()
    .required()
    .test("city", "Invalid City", (city) =>
      cities.includes(city?.toUpperCase()!)
    ),
  category: yup
    .string()
    .required()
    .test("category", "Invalid Categroy", (category) =>
      categories.includes(category?.toUpperCase()!)
    ),
  displayName: yup.string().required(),
  imageLink: yup.string(),
});

export const numberValidationSchema = yup
  .string()
  .trim()
  .matches(/^[6-9]{1}[0-9]{9}$/);

type IPost = yup.InferType<typeof postsValidationSchema>;

const PostSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    imageLink: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.posts || model<IPost>("posts", PostSchema);
