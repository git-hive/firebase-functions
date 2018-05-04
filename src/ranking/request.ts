import { firestore } from "firebase-functions";

const ASSOCIATION_REQUEST_WILDCARD =
  "/associations/{associationID}/requests/{requestID}";

export default firestore
  .document(ASSOCIATION_REQUEST_WILDCARD)
  .onUpdate(change => {
    console.log("[requestRanking]", "start");
    const [before, after] = [change.before.data(), change.after.data()];
    if (
      before.numComments === after.numComments &&
      before.score === after.score
    ) {
      return true;
    }

    const numComments = Number(after.numComments);
    const score = Number(after.score);
    if (isNaN(score) || isNaN(numComments)) {
      console.log("[requestRanking]", "NaN");
      return true;
    }

    const rank = score + numComments;

    console.log("[requestRanking]", "ended");
    return change.after.ref.set({ rank }, { merge: true });
  });
