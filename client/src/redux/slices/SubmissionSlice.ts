import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const fakeSubmission = [
  {
    _id: "1",
    title: "Viet's submission",
    owner: "Hoang Viet",
    contributionId: "1",
    createdAt: "2024-03-20T04:46:31.010Z",
    updatedAt: "2024-03-20T04:46:31.010Z",
  },
  {
    _id: "2",
    title: "Tuan Anh's submission",
    owner: "Tuan Anh",
    contributionId: "1",
    createdAt: "2024-03-20T04:46:31.010Z",
    updatedAt: "2024-03-20T04:46:31.010Z",
  },
  {
    _id: "3",
    title: "Tung's submission",
    owner: "Tung Ngo",
    contributionId: "1",
    createdAt: "2024-03-20T04:46:31.010Z",
    updatedAt: "2024-03-20T04:46:31.010Z",
  },
  {
    _id: "4",
    title: "Ha's submission",
    owner: "Ha Nguyen",
    contributionId: "1",
    createdAt: "2024-03-20T04:46:31.010Z",
    updatedAt: "2024-03-20T04:46:31.010Z",
  },
];

export interface Submission {
  _id: string;
  title: string;
  owner: string;
  contributionId: string;
  updatedAt: string;
  createdAt: string;
}

interface SubmissionState {
  submissions: Submission[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalLength: number;
}

const initialState: SubmissionState = {
  submissions: fakeSubmission,
  isLoading: false,
  currentPage: 1,
  totalPages: 0,
  totalLength: 0,
};

const SubmissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {
    setLoadingSubmission(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAllSubmissions(state, action: PayloadAction<Submission[]>) {
      state.submissions = action.payload;
    },
  },
});

const { reducer, actions } = SubmissionSlice;

export const { setLoadingSubmission, setAllSubmissions } = actions;

export default reducer;
