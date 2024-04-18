import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Faculty {
  _id: string;
  name: string;
  marketingCoordinatorId?: Object;
}

interface FacultyState {
  faculties: Faculty[];
  faculty: Faculty;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalLength: number;
}

const initialState: FacultyState = {
  faculties: [],
  isLoading: false,
  currentPage: 1,
  totalPages: 0,
  totalLength: 0,
  faculty: {
    _id: "",
    name: "",
    marketingCoordinatorId: {
      name: "",
      _id: "",
    },
  },
};

const slice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    setFaculties: (state, action: PayloadAction<Faculty[]>) => {
      state.faculties = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTotalPage(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
    setTotalLength(state, action: PayloadAction<number>) {
      state.totalLength = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

const { reducer, actions } = slice;

export const {
  setFaculties,
  setIsLoading,
  setTotalPage,
  setTotalLength,
  setCurrentPage,
} = actions;

export type { FacultyState, Faculty };

export default reducer;
