import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";

export default function useGetFriendRequests() {
  const [getRequestLoading, setGetRequestLoading] = useState(false);
  
  const handleGetFriendRequests = async (nickname) => {
    setGetRequestLoading(true);
    try {
      const q = query(
        collection(db, 'friendRequests'),
        where('toNickname', '==', nickname),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));  
    } catch (err) {
      console.error(`GetFriendRequests error: ${err}`);
    } finally {
      setGetRequestLoading(false);
    }
  };

  return { handleGetFriendRequests, getRequestLoading };
}
