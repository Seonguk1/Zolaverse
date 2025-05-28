import { db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function useCreateFriendRequest() {
    const handleCreateFriendRequest = async (from, to) => {
        const friendRequestRef = doc(db, "friendRequests");
        await setDoc(friendRequestRef, {
            from,
            to,
            status: 'pending',
            createdAt: new Date()
        })
    };

    return { handleCreateFriendRequest };
}