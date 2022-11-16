"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucketName = exports.postBucket = exports.storage = exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const serviceAccountKey_json_1 = __importDefault(require("../serviceAccountKey.json"));
const storage_1 = require("firebase-admin/storage");
const app = (0, app_1.getApps)().length > 0
    ? (0, app_1.getApp)()
    : (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccountKey_json_1.default),
    });
// https://console.firebase.google.com/project/trending-art-a4365/storage/trending-art-a4365.appspot.com/files
const db = (0, firestore_1.getFirestore)();
exports.db = db;
const storage = (0, storage_1.getStorage)();
exports.storage = storage;
const bucketName = "trending-art-a4365.appspot.com";
exports.bucketName = bucketName;
const postBucket = storage.bucket(`gs://${bucketName}`);
exports.postBucket = postBucket;
