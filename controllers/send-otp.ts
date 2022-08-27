import { Handler } from "express";
import { ValidationError } from "yup";
import { numberValidationSchema } from "../modals/posts";
import users from "../modals/users";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendOtp: Handler = async (req, res) => {
  const apiKey = process.env.OTP_API_KEY;

  const number = req.body.phone;

  const doc = await users.findOne({
    phone: number,
  });

  if (doc) {
    if (doc.verified)
      return res.status(201).json({ message: `Already Verified` });
    else if (
      (new Date().getTime() - new Date(doc.updatedAt).getTime()) / 1000 <
      60
    ) {
      return res.status(401).json({ message: `Retry after Sometime` });
    }
  }

  try {
    await numberValidationSchema.validate(number);
    if (!doc) {
      await users.create({
        phone: number,
      });
    } else {
      await doc.update({ verified: false });
    }

    await axios.get(
      `https://2factor.in/API/V1/${apiKey}/SMS/+91${number}/AUTOGEN/OTP1`,
      {}
    );
    return res.json({ message: "OTP sent to the phone number" });
  } catch (error) {
    console.error(error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.errors[0] });
    } else return res.status(500).json({ message: "Something went wrong" });
  }
};

export { sendOtp };
