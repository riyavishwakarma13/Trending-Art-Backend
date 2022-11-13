import { Schema, models, model } from "mongoose";
import * as yup from "yup";

const countries = [
  "INDIA",
  "SWITZERLAND",
  "GERMANY",
  "CANADA",
  "UNITED STATES",
  "SWEDEN",
  "JAPAN",
  "AUSTRALIA",
  "UNITED KINGDOM",
  "FRANCE",
  "DENMARK",
  "NEW ZEALAND",
  "NORWAY",
  "ITALY",
  "FINLAND",
  "SPAIN",
  "CHINA",
  "BELGIUM",
  "SINGAPORE",
  "SOUTH KOREA",
  "UNITED ARAB EMIRATES",
  "AUSTRIA",
  "IRELAND",
  "GREECE",
  "OTHERS",
];

export const postsValidationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email(),
  contact: yup
    .string()
    .required()
    .matches(/^[6-9]{1}[0-9]{9}$/, "Invalid Phone Number"),
  country: yup
    .string()
    .required()
    .test("country", "Invalid Country", (country) =>
      countries.includes(country?.toUpperCase()!)
    ),
  displayName: yup.string().required(),
  imageLink: yup.string(),
});

export const numberValidationSchema = yup
  .string()
  .trim()
  .matches(/^[6-9]{1}[0-9]{9}$/, "Invalid Phone Number");

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
    contact: {
      type: String,
      unique: true,
      required: true,
    },
    country: {
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
