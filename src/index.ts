import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import sessionEndJob from "./scheduler/sessionEnd";
import requestRanking from "./ranking/request";

admin.initializeApp();

sessionEndJob(admin.firestore()).start();

export const api = functions.https.onRequest((req, res) => {
  res.send("Hello, Hive!");
});

export const requestRankingListener = requestRanking;
