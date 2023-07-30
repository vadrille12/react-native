import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  userId: null,
  login: null,
  photoUri: null,
  stateChange: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      login: payload.login,
      photoUri: payload.photoUri,
    }),
    updateUserAvatar: (state, { payload }) => ({
      ...state,
      photoUri: payload.photoUri,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    logout: () => INITIAL_STATE,
  },
});
