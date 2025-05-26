import { db } from "@/config/firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

// 예외 루틴 저장 or 수정 (덮어쓰기)
export const setRoutineOverride = async (userId, date, routines) => {
  try {
    const ref = doc(db, "users", userId, "routineOverrides", date);
    await setDoc(ref, { date, routines, updatedAt: new Date() });
  } catch (error) {
    console.error("예외 루틴 저장 실패", error);
    throw error;
  }
};

// 예외 루틴 조회
export const getRoutineOverride = async (userId, date) => {
  try {
    const ref = doc(db, "users", userId, "routineOverrides", date);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error("예외 루틴 불러오기 실패", error);
    throw error;
  }
};

// 예외 루틴 삭제
export const deleteRoutineOverride = async (userId, date) => {
  try {
    const ref = doc(db, "users", userId, "routineOverrides", date);
    await deleteDoc(ref);
  } catch (error) {
    console.error("예외 루틴 삭제 실패", error);
    throw error;
  }
};
