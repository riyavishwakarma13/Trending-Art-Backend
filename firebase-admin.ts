import {
    initializeApp,
    cert,
    ServiceAccount,
    getApps,
    getApp,
  } from "firebase-admin/app";
  import { getFirestore } from "firebase-admin/firestore";
  import serviceAccount from "./serviceAccountKey.json";
  import { getStorage } from "firebase-admin/storage";
  
  const app =
    getApps().length > 0
      ? getApp()
      : initializeApp({
          credential: cert(serviceAccount as ServiceAccount),
        });
        // https://console.firebase.google.com/project/trending-art-a4365/storage/trending-art-a4365.appspot.com/files
  const db = getFirestore();
  const storage = getStorage();
  const bucketName = "trending-art-a4365.appspot.com";
  const postBucket = storage.bucket(`gs://${bucketName}`);
  export { db, storage, postBucket, bucketName };