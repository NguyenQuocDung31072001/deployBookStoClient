import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  register: {
    isFetching: false,
    success: false,
    error: false,
  },
  login: {
    isFetching: false,
    currentUser: null,
    error: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state, action) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state, action) => {
      state.register.isFetching = false;
      state.register.success = true;
      state.register.error = false;
    },
    registerFailed: (state, action) => {
      state.register.isFetching = false;
      state.register.success = false;
      state.register.error = true;
    },
    loginStart: (state, action) => {
      state.login.isFetching = true;
      state.login.currentUser = null;
      state.login.error = false;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.error = true;
    },
    logout: (state) => {
      state.login.currentUser = null;
    },
    updateCurrentUser:(state,action)=>{
      state.login.currentUser=action.payload
    }
  },
});
export const {
  registerStart,
  registerSuccess,
  registerFailed,
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  updateCurrentUser
} = authSlice.actions;

export default authSlice.reducer;
