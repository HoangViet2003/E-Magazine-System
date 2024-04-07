import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from "date-fns";

interface Faculty {
  _id: string;
  name: string;
  description: string;
}

interface FacultyState {
  faculties: Faculty[];
  faculty: Faculty;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalLength: number;
}

const initialState: FacultyState = {
  faculties: [],
  loading: false,
  currentPage: 1,
  totalPages: 0,
  totalLength: 0,
  faculty: {
    _id: "",
    name: "",
    description: "",
  },
};

const slice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    setFaculties: (state, action: PayloadAction<Faculty[]>) => {
      state.faculties = action.payload;
    }
  },
});

const { reducer, actions } = slice;

export const {setFaculties} = actions;

export type { FacultyState, Faculty };

export default reducer;
