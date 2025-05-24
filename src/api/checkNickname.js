import { db } from '@/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const checkNicknameExists = async (nickname) => {
  const q = query(
    collection(db, 'users'),
    where('nickname', '==', nickname)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // true면 중복 있음
};

export default checkNicknameExists;