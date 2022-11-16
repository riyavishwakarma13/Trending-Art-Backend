"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.over = void 0;
const over = (req, res, next) => {
    return res.status(400).json({ message: "Voting and Posting is over!" });
};
exports.over = over;
