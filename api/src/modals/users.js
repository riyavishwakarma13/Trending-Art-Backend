"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Users = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.models.users ||
    (0, mongoose_1.model)("users", Users);
