import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
  User
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { auth, db } from "../firebase/config";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Основний Web Client ID (для Firebase)
    webClientId: "752552917614-kbpetdssrppkqv8mi055mdl1qpa51p1m.apps.googleusercontent.com",
    
    // Android Client ID з вашим SHA-1
    androidClientId: "752552917614-t5g16uii6qn45tpgql8or5na9iu0lalo.apps.googleusercontent.com",
    
    // iOS Client ID
    iosClientId: "752552917614-t5g16uii6qn45tpgql8or5na9iu0lalo.apps.googleusercontent.com",

    // Використовуємо автоматичну генерацію URI для Expo Go
    // redirectUri: makeRedirectUri({
    //   scheme: "budget-app",
    //   path: "firebaseauth/link",
    // }),
  });

  const syncUserWithFirestore = async (user: User) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          familyId: null,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
        console.log("✅ New user created in Firestore");
      } else {
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        console.log("✅ User session updated");
      }
    } catch (e) {
      console.error("❌ Firestore sync error:", e);
    }
  };

  // Відстежуємо зміну стану відповіді від Google
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          syncUserWithFirestore(userCredential.user);
        })
        .catch((error) => {
          console.error("❌ Firebase Auth Error:", error);
        });
    }
  }, [response]);

  const signIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === "success") {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        await syncUserWithFirestore(userCredential.user);
        return userCredential.user;
      }
    } catch (error) {
      console.error("❌ Sign In Error:", error);
    }
    return null;
  };

  return { signIn, isReady: !!request };
};