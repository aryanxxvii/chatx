import { db } from "@/utils/firebase"
import { doc } from "firebase/firestore"
import { useDocument } from "react-firebase-hooks/firestore"

export default function useRoom(roomId, userId) {
  const isUserRoom = roomId.includes(userId)
  const collectionId = isUserRoom ? "users" : "rooms"
  const docId = isUserRoom ? roomId.replace(userId, "") : roomId
  const [snapshot] = useDocument(
    docId ? doc(db, `${collectionId}/${docId}`) : null
  )

  if (!snapshot?.exists()) return null

  return {
    id: snapshot.id,
    photoURL:
      snapshot.photoURL ||
      `https://source.boringavatars.com/marble/45/${snapshot.id}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`,
    ...snapshot.data(),
  }
}
