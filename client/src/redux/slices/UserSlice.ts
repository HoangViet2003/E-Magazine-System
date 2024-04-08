import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  facultyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  user: User;
  users: User[];
  isAuth: boolean;
  isLoading: boolean;
  isLoadingTable: boolean;
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
  users: [],
  isAuth: false,
  isLoading: false,
  isLoadingTable: false,
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
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    setIsLoadingTable(state, action: PayloadAction<boolean>) {
      state.isLoadingTable = action.payload;
    
    }
  },
});

const { reducer, actions } = UserSlice;

export const { setLoadingUser, setUser,setUsers,setIsLoadingTable } = actions;

export default reducer;
