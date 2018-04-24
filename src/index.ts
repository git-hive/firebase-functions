import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import sessionEndJob from "./scheduler/sessionEnd";

admin.initializeApp();

sessionEndJob(admin.firestore()).start();

export const api = functions.https.onRequest((req, res) => {
  res.send("Hello, Hive!");
});
