import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithCredential,
  signOut
} from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where, writeBatch } from "firebase/firestore";
import { deleteObject, getStorage, listAll, ref } from "firebase/storage";
import { auth, db } from "../config/firebase";

const storage = getStorage();

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

const USER_COLLECTIONS = [
  "categories", 
  "meter_readings", 
  "meters", 
  "transactions", 
  "userSettings", 
  "wallets"
];

export const deleteUserStorageFolder = async (userId: string) => {
  const folderRef = ref(storage, `meter_photos/${userId}`);
  try {
    const res = await listAll(folderRef);
    const deletePromises = res.items.map((item) => deleteObject(item));
    await Promise.all(deletePromises);
    console.log(`✅ Storage photos for user ${userId} deleted`);
  } catch (error) {
    console.error("❌ Error deleting storage folder:", error);
  }
};

export const cleanupUserData = async (userId: string) => {
  for (const colName of USER_COLLECTIONS) {
    const q = query(collection(db, colName), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    
    let batch = writeBatch(db);
    let count = 0;
    
    for (const document of snapshot.docs) {
      batch.delete(document.ref);
      count++;
      if (count === 490) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) await batch.commit();
  }

  try {
    await deleteDoc(doc(db, "userSettings", userId));
  } catch (e) {
  }

  await deleteUserStorageFolder(userId);
};

export const migrateDataToNewUser = async (oldUserId: string, newUserId: string) => {
  for (const colName of USER_COLLECTIONS) {
    const q = query(collection(db, colName), where("userId", "==", oldUserId));
    const snapshot = await getDocs(q);
    
    let batch = writeBatch(db);
    let count = 0;
    
    for (const document of snapshot.docs) {
      batch.update(document.ref, { userId: newUserId });
      count++;
      if (count === 490) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) await batch.commit();
  }
};

export const loginAnonymously = async () => {
  try {
    const { user } = await signInAnonymously(auth);
    return user;
  } catch (error) {
    console.error("Помилка анонімного входу:", error);
    return null;
  }
};

export const linkWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    const idToken = userInfo.data?.idToken || (userInfo as any).idToken;

    if (!idToken) {
      return { success: false, error: 'Google sign-in token is missing' };
    }
    
    const credential = GoogleAuthProvider.credential(idToken);
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'No user' };

    try {
      await linkWithCredential(user, credential);
      return { success: true, mode: 'linked' };
    } catch (linkError: any) {
      if (linkError.code === 'auth/credential-already-in-use') {
        return { success: false, conflict: true, credential };
      }
      throw linkError;
    }
  } catch (error) {
    console.error("Помилка прив'язки Google:", error);
    return { success: false, error };
  }
};

export const resolveAuthConflict = async (credential: any, choice: 'keep_cloud' | 'keep_local') => {
  const anonUser = auth.currentUser;
  if (!anonUser) return false;
  const anonUid = anonUser.uid;

  try {
    let resultUser;
    if (choice === 'keep_cloud') {
      await cleanupUserData(anonUid);
      await anonUser.delete();
      const result = await signInWithCredential(auth, credential);
      resultUser = result.user;
    } 
    else if (choice === 'keep_local') {
      const googleResult = await signInWithCredential(auth, credential);
      const googleUid = googleResult.user.uid;
      
      await cleanupUserData(googleUid); 
      await migrateDataToNewUser(anonUid, googleUid);
      resultUser = googleResult.user;
    }
    if (resultUser) {
      await saveUserProfile(resultUser);
    }
    return true;
  } catch (error) {
    console.error("Помилка вирішення конфлікту:", error);
    return false;
  }
};

export const logoutUser = async () => {
  const user = auth.currentUser;
  if (user?.isAnonymous) {
    const uid = user.uid;
    await cleanupUserData(uid); 
    await user.delete();
  } else {
    await signOut(auth);
    await GoogleSignin.signOut();
  }
};

export const saveUserProfile = async (user: any) => {
  if (!user || user.isAnonymous) return;

  const userRef = doc(db, "users", user.uid);
  
  try {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true }); 
    
    console.log(`✅ Профіль користувача ${user.uid} збережено в БД`);
  } catch (error) {
    console.error("❌ Помилка збереження профілю:", error);
  }
};

export const loginWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    const idToken = userInfo.data?.idToken || (userInfo as any).idToken;
    if (!idToken) return { success: false, error: 'Token missing' };

    const credential = GoogleAuthProvider.credential(idToken);
    const { user } = await signInWithCredential(auth, credential);
    await saveUserProfile(user);
    return { success: true, user };
  } catch (error) {
    console.error("Помилка входу через Google:", error);
    return { success: false, error };
  }
};