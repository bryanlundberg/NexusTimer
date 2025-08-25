export const FirestoreCollections = {
  CLASH_ROOMS: 'clash-rooms',
  CLASH_ROOMS_MESSAGES: (roomId: string) => `${FirestoreCollections.CLASH_ROOMS}/${roomId}/messages`
};
