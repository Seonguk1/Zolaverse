import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useUserInfo() {
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setUserDoc(null);
        setUserFriends([]);
        setUserLoading(false);
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      try {
        // 1. 유저 기본 문서 가져오기
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          console.warn("유저 문서 없음");
          setUserDoc(null);
          setUserFriends([]);
          router.replace("/login");
          return;
        }

        setUserDoc(docSnap.data());

        // 2. 친구 서브컬렉션 가져오기
        const friendsRef = collection(db, "users", currentUser.uid, "friends");
        const friendsSnap = await getDocs(friendsRef);
        const friends = friendsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserFriends(friends);

      } catch (err) {
        console.error("userInfo 가져오기 실패:", err);
        setUserDoc(null);
        setUserFriends([]);
        router.replace("/login");
      } finally {
        setUserLoading(false);
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return { user, userDoc, userFriends, userLoading };
}
