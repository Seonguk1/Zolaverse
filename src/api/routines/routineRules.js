import { db } from "@/config/firebase";
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";

// 반복 루틴 생성
export const createRoutineRule = async (userId, ruleData) => {
  try {
    const rulesRef = collection(db, "users", userId, "routineRules");
    const newDoc = doc(rulesRef);
    await setDoc(newDoc, { ...ruleData, createdAt: new Date() });
    return newDoc.id;
  } catch (error) {
    console.error("반복 루틴 생성 실패", error);
    throw error;
  }
};

// 반복 루틴 전체 불러오기
export const getRoutineRules = async (userId) => {
  try {
    const rulesRef = collection(db, "users", userId, "routineRules");
    const snapshot = await getDocs(rulesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("반복 루틴 불러오기 실패", error);
    throw error;
  }
};

// 반복 루틴 수정
export const updateRoutineRule = async (userId, ruleId, updatedData) => {
  try {
    const ruleRef = doc(db, "users", userId, "routineRules", ruleId);
    await updateDoc(ruleRef, updatedData);
  } catch (error) {
    console.error("반복 루틴 수정 실패", error);
    throw error;
  }
};

// 반복 루틴 삭제
export const deleteRoutineRule = async (userId, ruleId) => {
  try {
    const ruleRef = doc(db, "users", userId, "routineRules", ruleId);
    await deleteDoc(ruleRef);
  } catch (error) {
    console.error("반복 루틴 삭제 실패", error);
    throw error;
  }
};
