import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Faculty {
  _id: string;
  name: string;
  marketingCoordinatorId?: Object;
  selectedReports: string[];
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
    selectedReports: [],
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
    setFaculty: (state, action: PayloadAction<Faculty>) => {
      state.faculty = action.payload;
    },
  },
});

const { reducer, actions } = slice;

export const { setFaculties, setIsLoading, setFaculty } = actions;

export type { FacultyState, Faculty };

export default reducer;
