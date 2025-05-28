import { db } from "@/config/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export default function useSearchUsers(currentUserId) {
  const handleSearchUsers = async (nickname) => {
    const trimmed = nickname.trim().toLowerCase();
    if (!trimmed) return [];

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('nickname', '>=', trimmed),
      where('nickname', '<=', trimmed + '\uf8ff'),
      orderBy('nickname')
    );

    const snapshot = await getDocs(q);
    const users = snapshot.docs
      //.filter(doc => doc.id !== currentUserId) // 자기 자신 제외
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

    return users;
  };

  return { handleSearchUsers };
}
