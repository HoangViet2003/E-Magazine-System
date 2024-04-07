import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Submission } from "./SubmissionSlice";

export interface Contribution {
  _id: string;
  facultyId?: string;
  submissions?: Submission[];
  status?: string;
  academicYear?: number;
  closureDate?: string;
  finalClosureDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContributionState {
  isLoading: boolean;
  contributions: Contribution[];
  managerContributions: Contribution[];
  contribution: Contribution;
}

const initialState: ContributionState = {
  isLoading: false,
  contributions: [],
  managerContributions: [],
  contribution: {
    _id: "",
    facultyId: "",
    submissions: [],
    status: "",
    academicYear: 0,
    closureDate: "",
    finalClosureDate: "",
    createdAt: "",
    updatedAt: "",
  },
};

const ContributionSlice = createSlice({
  name: "contribution",
  initialState,
  reducers: {
    setLoadingContribution(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAllContribution(state, action: PayloadAction<Contribution[]>) {
      state.contributions = action.payload;
    },
    setAllManagerContribution(state, action: PayloadAction<Contribution[]>) {
      state.managerContributions = action.payload;
    },
    setContribution(state, action: PayloadAction<Contribution>) {
      state.contribution = action.payload;
    },
  },
});

const { reducer, actions } = ContributionSlice;

export const {
  setLoadingContribution,
  setAllContribution,
  setAllManagerContribution,
  setContribution,
} = actions;

export default reducer;
