import { CronJob } from "cron";
import {
  getAssociationRef,
  getAssociationsCol,
  getAssociationSessionsCol
} from "../firestore/association";

// Seconds: 0-59
// Minutes: 0-59
// Hours: 0-23
// Day of Month: 1-31
// Months: 0-11 (Jan-Dec)
// Day of Week: 0-6 (Sun-Sat)

const HOURLY_CRON = "0 0 * * * *";
const SESSION_STATUS = {
  OPENED: "current",
  ENDED: "ended"
};

export default function createSessionEndJob(
  db: FirebaseFirestore.Firestore
): CronJob {
  return new CronJob(HOURLY_CRON, async () => {
    console.log("[sessionsEnd]", "start");
    // Get associations collection ref
    const associationsDocs = await getAssociationsCol(db).get();
    const associationsIDs = [];
    // Aggregate association IDs
    associationsDocs.forEach(doc => {
      associationsIDs.push(doc.id);
    });

    console.log("[sessionsEnd]", "associationsIDs", associationsIDs);

    // For each association ID
    associationsIDs.map(async associationID => {
      // Get sessions that have not ended and actually should
      try {
        const currentTimeInMillis = Number(new Date());
        const endedSessionsDocs = await getAssociationSessionsCol(
          db,
          associationID
        )
          .where("status", "==", SESSION_STATUS.OPENED)
          .where("endsAt", "<=", currentTimeInMillis)
          .get();

        console.log(
          "[sessionsEnd]",
          "endedSessionsDocs",
          endedSessionsDocs.docs
        );

        // Update session status
        endedSessionsDocs.forEach(async doc => {
          console.log("[sessionsEnd]", "closing session", doc.id);
          await doc.ref.set({ status: SESSION_STATUS.ENDED }, { merge: true });
        });
      } catch (error) {
        console.error(new Error(error));
      }
    });
    console.log("[sessionsEnd]", "end");
  });
}
