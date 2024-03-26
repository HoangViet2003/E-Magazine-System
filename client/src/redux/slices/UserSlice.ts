import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  facultyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  user: User;
  isAuth: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  user: {
    _id: "",
    name: "",
    email: "",
    role: "",
    createdAt: "",
    updatedAt: "",
  },
  isAuth: false,
  isLoading: false,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoadingUser(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuth = true;
    },
  },
});

const { reducer, actions } = UserSlice;

export const { setLoadingUser, setUser } = actions;

export default reducer;
