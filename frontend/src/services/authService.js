import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import api from '../lib/axios';

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const token = await result.user.getIdToken();
  const response = await api.post('/auth/verify', { token });
  return { firebaseUser: result.user, user: response.data.data };
};

export const signInWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const token = await result.user.getIdToken();
  const response = await api.post('/auth/verify', { token });
  return { firebaseUser: result.user, user: response.data.data };
};

export const signUpWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  const token = await result.user.getIdToken();
  const response = await api.post('/auth/verify', { token, displayName });
  return { firebaseUser: result.user, user: response.data.data };
};

export const logout = async () => {
  await signOut(auth);
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const getCurrentUserProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

export const updateUserProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data.data;
};
