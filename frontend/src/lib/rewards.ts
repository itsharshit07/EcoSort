// utils/rewards.ts
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const updateUserRewards = async (userEmail: string, pointsToAdd: number) => {
  if (!userEmail) return;

  const userRef = doc(db, "userRewards", userEmail);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const currentPoints = userSnap.data().points || 0;
    await updateDoc(userRef, {
      points: currentPoints + pointsToAdd,
    });
  } else {
    await setDoc(userRef, {
      points: pointsToAdd,
    });
  }
};
