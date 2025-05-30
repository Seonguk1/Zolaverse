import { db } from '@/config/firebase';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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

            // 친구의 루틴 정보 읽기
            const fromUserDocSnap = await getDoc(doc(db, "users", fromId));
            const toUserDocSnap = await getDoc(doc(db, "users", toId));
            const fromUserData = fromUserDocSnap.data();
            const toUserData = toUserDocSnap.data();

            // 2. from → to 친구 추가 (to의 루틴 정보 복제)
            await setDoc(doc(db, "users", fromId, "friends", toId), {
                id: toId,
                nickname: toNickname,
                sleepStart: toUserData.sleepStart || null,
                sleepEnd: toUserData.sleepEnd || null,
                workStart: toUserData.workStart || null,
                workEnd: toUserData.workEnd || null,
                createdAt: serverTimestamp(),
            });

            // 3. to → from 친구 추가 (from의 루틴 정보 복제)
            await setDoc(doc(db, "users", toId, "friends", fromId), {
                id: fromId,
                nickname: fromNickname,
                sleepStart: fromUserData.sleepStart || null,
                sleepEnd: fromUserData.sleepEnd || null,
                workStart: fromUserData.workStart || null,
                workEnd: fromUserData.workEnd || null,
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