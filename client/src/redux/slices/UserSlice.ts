import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setToTalPage } from "./NotiSlice";

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
  totalPage: number;
  totalLength: number;
  currentPage: number;
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
  totalPage: 0,
  totalLength: 0,
  currentPage: 1,
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
    },
    setTotalPage(state, action: PayloadAction<number>) {
      state.totalPage = action.payload;
    },
    setTotalLength(state, action: PayloadAction<number>) {
      state.totalLength = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    }
  },
});

const { reducer, actions } = UserSlice;

export const { setLoadingUser, setUser, setUsers, setIsLoadingTable,setTotalPage,setTotalLength,setCurrentPage } = actions;

export default reducer;
