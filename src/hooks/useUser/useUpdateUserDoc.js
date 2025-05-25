import { db } from "@/config/firebase";
import useGetUserDoc from "@/hooks/useUser/useGetUserDoc";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
export default function useUpdateUserDoc() {
    const { user, userDoc, userLoading } = useGetUserDoc();
    const userRef = user ? doc(db, "users", user.uid) : null;
    const [updateLoading, setUpdateLoading] = useState(false);

    const updateUserDoc = async (data) => {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        setUpdateLoading(true);

        try {
            await updateDoc(userRef, data);
        } catch (err) {
            console.error("문서 업데이트 실패:", err);
        } finally {
            setUpdateLoading(false);
        }
    }
    return { updateUserDoc, updateLoading };
};