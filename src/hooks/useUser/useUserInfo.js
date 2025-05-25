import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const useUserInfo = ()=>{
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          router.replace('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserInfo({
            uid: currentUser.uid,
            email: currentUser.email,
            nickname: userDoc.data().nickname,
            createdAt: currentUser.metadata.creationTime,
          });
        } else {
            router.replace('/home');
        }
      } catch (err) {
        console.error("userInfo 가져오기 실패", err);
        router.replace('/home');
      } finally {
        setUserLoading(false);
      } 
    };

    fetchUserInfo();
  }, []);

  return { userInfo, userLoading };
}

export default useUserInfo;