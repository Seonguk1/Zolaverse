import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useUserInfo (){
    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userDoc, setUserDoc] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    router.replace('/login');
                    return;
                }
                const docSnap = await getDoc(doc(db, "users", currentUser.uid));
                if (!docSnap.exists()) {
                    router.replace('/login');
                }
                setUser(currentUser);
                setUserDoc(docSnap  .data());
            } catch (err) {
                console.error("userInfo 가져오기 실패", err);
                router.replace('/login');
            } finally {
                setUserLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return { user, userDoc, userLoading };
}

