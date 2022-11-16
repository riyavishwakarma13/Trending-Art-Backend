declare const db: FirebaseFirestore.Firestore;
declare const storage: import("firebase-admin/storage").Storage;
declare const bucketName = "trending-art-a4365.appspot.com";
declare const postBucket: import("@google-cloud/storage/build/src/bucket").Bucket;
export { db, storage, postBucket, bucketName };
