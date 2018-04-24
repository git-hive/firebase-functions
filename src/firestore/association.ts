import collections from "./collections";

/**
 * Gets the reference to the associations collection
 *
 * @param db Firestore ref
 */
export function getAssociationsCol(
  db: FirebaseFirestore.Firestore
): FirebaseFirestore.CollectionReference {
  return db.collection(collections.ASSOCIATIONS);
}

/**
 * Gets the reference to the association under the provided ID
 *
 * @param db Firestore ref
 * @param associationID Association document ID
 */
export function getAssociationRef(
  db: FirebaseFirestore.Firestore,
  associationID: string
): FirebaseFirestore.DocumentReference {
  return getAssociationsCol(db).doc(associationID);
}

/**
 * Gets the reference to the association sessions collection
 *
 * @param db Firestore ref
 * @param associationID Association document ID
 */
export function getAssociationSessionsCol(
  db: FirebaseFirestore.Firestore,
  associationID: string
): FirebaseFirestore.CollectionReference {
  return getAssociationRef(db, associationID).collection(collections.SESSIONS);
}
