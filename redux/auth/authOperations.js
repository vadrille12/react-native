import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase/config";

import { authSlice } from "./authSlice";

const getCurrentUser = () => auth.currentUser;

export const register =
  ({ email, password, login, photoUri }) =>
  async (dispatch, getState) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      await updateProfile(user, {
        displayName: login,
        photoURL: photoUri,
      });

      const { uid, displayName, photoURL } = getCurrentUser();

      dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          login: displayName,
          photoUri: photoURL,
        })
      );
    } catch (error) {
      console.log("Ошибка при регистрации:", error);
      console.log("Ошибка:", error.message);
    }
  };

export const login =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logined:", user);
    } catch (error) {
      console.log("Error during login:", error);
      console.log("Error message:", error.message);
    }
  };

export const logout = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authSlice.actions.logout());
  } catch (error) {
    console.log("Error during logout:", error);
    console.log("Error message:", error.message);
  }
};

export const refresh = () => async (dispatch, getState) => {
  onAuthStateChanged(auth, (user) => {
    console.log(user.photoURL);
    if (user) {
      dispatch(
        authSlice.actions.updateUserProfile({
          userId: user.uid,
          login: user.displayName,
          photoUri: user.photoURL,
        })
      );
      dispatch(authSlice.actions.authStateChange({ stateChange: true }));
    }
  }); 
};

export const updateAvatar = (photoURL) => async (dispatch) => {
  try {
    await updateProfile(auth.currentUser, {
      photoURL,
    });

    const userSuccess = auth.currentUser;
    dispatch(
      authSlice.actions.updateUserAvatar({
        photoUri: userSuccess.photoURL,
      })
    );
  } catch (error) {
    console.log(error.message);
  }
};