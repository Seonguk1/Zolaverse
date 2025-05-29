import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

export default function useCreateFriendRequest() {
    const [requestLoading, setRequestLoading] = useState(false);
    const handleCreateFriendRequest = async (fromId, toId, fromNickname, toNickname) => {
        try {
            setRequestLoading(true);
            await addDoc(collection(db, "friendRequests"), {
                fromId, 
                toId, 
                fromNickname, 
                toNickname,
                status: "pending",
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("친구 요청 생성 실패:", error);
        }
        finally {
            setRequestLoading(false);
        }
    };  

    return { handleCreateFriendRequest, requestLoading };
}
