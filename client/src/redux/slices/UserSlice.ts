import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  loading: boolean;
  users: User[];
}

const initialState: UserState = {
  users: [],
  loading: false,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoadingUser(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAllUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
  },
});

const { reducer, actions } = UserSlice;

export const { setLoadingUser, setAllUsers } = actions;

export default reducer;
