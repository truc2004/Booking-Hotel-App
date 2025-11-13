import { auth } from "@/src/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { create } from "zustand";

type LiteUser = Pick<User, "uid" | "email" | "displayName" | "photoURL" | "phoneNumber">;

type AuthState = {
  user: LiteUser | null;
  loading: boolean;
  init: () => void;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (name: string, email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

let bound = false;

auth.languageCode = "vi";

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  init: () => {
    if (bound) return;
    bound = true;
    onAuthStateChanged(auth, (u) => {
      if (u) {
        const lite: LiteUser = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          phoneNumber: u.phoneNumber,
        };
        set({ user: lite, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  signIn: async (email, pass) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    if(!cred.user.emailVerified){
      try{ await sendEmailVerification(cred.user); }catch{} 
      throw { code: "app/email-not-verified" };
      }
  },

   signUp: async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    if (user && name) {
      await updateProfile(user, { displayName: name });
    }

    // ✅ GỬI EMAIL VERIFY Ở ĐÂY
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  },


  signOut: async () => {
    await fbSignOut(auth);
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email.trim());
  },
}));
