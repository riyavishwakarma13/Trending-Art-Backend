import { Handler } from "express";
import posts, { numberValidationSchema } from "../modals/posts";
import users from "../modals/users";
import { ValidationError } from "yup";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const verifyOtp: Handler = async (req, res) => {
  const apiKey = process.env.OTP_API_KEY;

  const number = req.body.phone;
  const otp = req.body.otp;

  // TODO: Check if already verified
  try {
    await numberValidationSchema.validate(number);
    const doc = await posts.findOne({ phone: number });
    if (doc) {
      return res.status(402).json({ message: "Already Posted" });
    }

    const response = await axios.get(
      `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/91${number}/${otp}`
    );
    if (response.data.Details === "OTP Mismatch") {
      return res.status(401).json({ message: "OTP Mismatch" });
    }

    await users.updateOne(
      {
        phone: number,
      },
      {
        $set: { verified: true },
      }
    );

    return res.json({ message: "Verified" });
  } catch (error: any) {
    console.error(error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.errors[0] });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export { verifyOtp };
