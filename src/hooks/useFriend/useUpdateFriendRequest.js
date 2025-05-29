import { db } from '@/config/firebase';
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useState } from 'react';
export default function useUpdateFriendRequest() {
    const [updateRequestLoading, setUpdateRequestLoading] = useState(false);

    const acceptFriendRequest = async (docId, fromId, toId, fromNickname, toNickname) => {
        const ref = doc(db, "friendRequests", docId);
        setUpdateRequestLoading(true);
        
        try {
            await updateDoc(ref, {
                status: "accepted",
            });

            // 2. from → to 친구 추가
            await setDoc(doc(db, "users", fromId, "friends", toId), {
                nickname: toNickname,
                createdAt: serverTimestamp(),
            });

            // 3. to → from 친구 추가
            await setDoc(doc(db, "users", toId, "friends", fromId), {
                nickname: fromNickname,
                createdAt: serverTimestamp(),
            });

            console.log("친구 수락 완료");
        }
        catch (err) {
            console.error("친구 수락 중 오류:", err);
            throw err;
        } finally {
            setUpdateRequestLoading(false);
        }
    };
    return { acceptFriendRequest, updateRequestLoading };
}