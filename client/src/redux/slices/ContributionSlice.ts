import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const fakeData = [
//   {
//     _id: "1",
//     name: "Behind The Curtain _ Theatre Production Backstage...",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Tuan Anh",
//     updatedAt: "2024-03-05T00:41:05.610635+00:00",
//     createdAt: "2024-03-05T00:41:05.610635+00:00",
//   },
//   {
//     _id: "2",
//     name: "Shining Star _ Jane Doe Student Profile.docx",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Tuan Anh",
//     updatedAt: "2024-02-05T00:41:05.610635+00:00",
//     createdAt: "2024-02-05T00:41:05.610635+00:00",
//   },
//   {
//     _id: "3",
//     name: "Tech Wave 2024 _ Trends Reshaping Student.docx",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Nguyen Thi Thu Ha",
//     updatedAt: "2024-04-05T00:41:05.610635+00:00",
//     createdAt: "2024-04-05T00:41:05.610635+00:00",
//   },
//   {
//     _id: "4",
//     name: "Around The World Plates _ Culinary Adventures Exch...",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Tuan Anh",
//     updatedAt: "2024-09-05T00:41:05.610635+00:00",
//     createdAt: "2024-09-05T00:41:05.610635+00:00",
//   },
//   {
//     _id: "5",
//     name: "Ink And Imagination _ Creative Writing Workshop Reference",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Tuan Anh",
//     updatedAt: "2024-11-05T00:41:05.610635+00:00",
//     createdAt: "2024-11-05T00:41:05.610635+00:00",
//   },
// ];

export interface Contribution {
  _id?: string;
  title?: string;
  facultyId?: string;
  studentId?: string;
  uploadDate?: string;
  status?: string;
  academicYear?: string;
  closureDate?: string;
  updatedAt?: string;
  createdAt: string;
  contributionOfUser: [];
}

interface ContributionState {
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalLength: number;
  contributions: Contribution[];
  // contribution: Contribution;
}

const initialState: ContributionState = {
  contributions: [],
  loading: false,
  currentPage: 1,
  totalPages: 0,
  totalLength: 0,

  // contribution: {
  //   _id: "",
  //   name: "",
  //   owner: "",
  //   profile: "",
  //   action: "",
  //   updatedAt: "", // Fix typo here
  // },
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
