import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const sendNotification = async (userEmail: string, message: string) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userEmail,
      message,
      timestamp: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
