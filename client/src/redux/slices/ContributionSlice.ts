import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Submission } from "./SubmissionSlice";

// const fakeContribution = [
//   {
//     _id: "1",
//     title: "2024 Contributions",
//     isOpen: true,
//     year: 2024,
//   },
//   {
//     _id: "2",
//     title: "2023 Contributions",
//     isOpen: false,
//     year: 2023,
//   },
//   {
//     _id: "3",
//     title: "2022 Contributions",
//     isOpen: false,
//     year: 2022,
//   },
//   {
//     _id: "4",
//     title: "2021 Contributions",
//     isOpen: false,
//     year: 2021,
//   },
// ];

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
  contribution: Contribution;
}

const initialState: ContributionState = {
  isLoading: false,
  contributions: [],
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
    setContribution(state, action: PayloadAction<Contribution>) {
      state.contribution = action.payload;
    },
  },
});

const { reducer, actions } = ContributionSlice;

export const { setLoadingContribution, setAllContribution, setContribution } =
  actions;

export default reducer;
