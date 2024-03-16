import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Contribution {
  _id: string;
  name: string;
  owner: string;
  profile: string;
  action: string;
  updatedAt: string;
}

interface ContributionState {
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalLength: number;
  contributions: Contribution[];
  contribution: Contribution;
}

const initialState: ContributionState = {
  contributions: [],
  loading: false,
  currentPage: 1,
  totalPages: 0,
  totalLength: 0,
  contribution: {
    _id: "",
    name: "",
    owner: "",
    profile: "",
    action: "",
    updatedAt: "", // Fix typo here
  },
};

const ContributionSlice = createSlice({
  name: "contribution",
  initialState,
  reducers: {
    setLoadingContribution(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAllContributions(state, action: PayloadAction<Contribution[]>) {
      state.contributions = action.payload;
    },
  },
});

const { reducer, actions } = ContributionSlice;

export const { setLoadingContribution, setAllContributions } = actions;

export default reducer;
