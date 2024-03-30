import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./UserSlice";
import { Contribution } from "./ContributionSlice";

// const fakeSubmission = [
//   {
//     _id: "1",
//     title: "Viet's submission",
//     owner: "Hoang Viet",
//     contributionId: "1",
//     createdAt: "2024-03-20T04:46:31.010Z",
//     updatedAt: "2024-03-20T04:46:31.010Z",
//   },
//   {
//     _id: "2",
//     title: "Tuan Anh's submission",
//     owner: "Tuan Anh",
//     contributionId: "1",
//     createdAt: "2024-03-20T04:46:31.010Z",
//     updatedAt: "2024-03-20T04:46:31.010Z",
//   },
//   {
//     _id: "3",
//     title: "Tung's submission",
//     owner: "Tung Ngo",
//     contributionId: "1",
//     createdAt: "2024-03-20T04:46:31.010Z",
//     updatedAt: "2024-03-20T04:46:31.010Z",
//   },
//   {
//     _id: "4",
//     title: "Ha's submission",
//     owner: "Ha Nguyen",
//     contributionId: "1",
//     createdAt: "2024-03-20T04:46:31.010Z",
//     updatedAt: "2024-03-20T04:46:31.010Z",
//   },
// ];

export interface Submission {
  _id: string;
  title: string;
  student: User;
  contributionId: Contribution;
  isCommented: boolean;
  isSelectedForPublication: boolean;
  isFavorite: boolean;
  updatedAt: string;
  createdAt: string;
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
  },
});

const { reducer, actions } = SubmissionSlice;

export const { setLoadingSubmission, setAllSubmissions, setSubmission } =
  actions;

export default reducer;
