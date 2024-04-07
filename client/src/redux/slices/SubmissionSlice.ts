import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./UserSlice";
import { Contribution } from "./ContributionSlice";
import { Article } from "./ArticleSlice";

export interface Submission {
  _id: string;
  title: string;
  student: User;
  contributionId: Contribution;
  isCommented: boolean;
  isSelectedForPublication: boolean;
  isFavorite: boolean;
  unsubmitted: boolean;
  updatedAt: string;
  createdAt: string;
  articles?: Article[];
}

interface SubmissionState {
  submission: Submission;
  submissions: Submission[];
  isLoading: boolean;

  // currentPage: number;
  // totalPages: number;
  // totalLength: number;
}

const initialState: SubmissionState = {
  isLoading: false,
  submissions: [],
  submission: {
    _id: "",
    title: "",
    student: {
      _id: "",
      name: "",
      email: "",
      facultyId: "",
    },
    contributionId: {
      _id: "",
      academicYear: 0,
    },
    unsubmitted: false,
    articles: [] as Article[],
    isCommented: false,
    isSelectedForPublication: false,
    isFavorite: false,
    createdAt: "",
    updatedAt: "",
  },

  // currentPage: 1,
  // totalPages: 0,
  // totalLength: 0,
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
    setSubmission(state, action: PayloadAction<Submission>) {
      state.submission = action.payload;
    },
    resetSubmission(state) {
      state.submission = initialState.submission;
    },
  },
});

const { reducer, actions } = SubmissionSlice;

export const {
  setLoadingSubmission,
  setAllSubmissions,
  setSubmission,
  resetSubmission,
} = actions;

export default reducer;
