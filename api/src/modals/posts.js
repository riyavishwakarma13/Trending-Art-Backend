"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberValidationSchema = exports.postsValidationSchema = void 0;
const mongoose_1 = require("mongoose");
const yup = __importStar(require("yup"));
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
exports.postsValidationSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().email(),
    contact: yup
        .string()
        .required()
        .matches(/^[6-9]{1}[0-9]{9}$/, "Invalid Phone Number"),
    country: yup
        .string()
        .required()
        .test("country", "Invalid Country", (country) => countries.includes(country === null || country === void 0 ? void 0 : country.toUpperCase())),
    displayName: yup.string().required(),
    imageLink: yup.string(),
});
exports.numberValidationSchema = yup
    .string()
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/, "Invalid Phone Number");
const PostSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.models.posts || (0, mongoose_1.model)("posts", PostSchema);
