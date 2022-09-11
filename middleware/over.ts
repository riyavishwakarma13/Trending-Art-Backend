import { Handler } from "express";

const over: Handler = (req, res, next) => {
  return res.status(400).json({ message: "Voting and Posting is over!" });
};


export { over };