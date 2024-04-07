import { configureStore } from "@reduxjs/toolkit";

import articleSlice from "./slices/ArticleSlice";
import contributionSlice from "./slices/ContributionSlice";
import userSlice from "./slices/UserSlice";
import submissionSlice from "./slices/SubmissionSlice";
import notiSlice from "./slices/NotiSlice"
import facultySlice from "./slices/FacultySlice"

const rootReducer = {
  user: userSlice,
  article: articleSlice,
  contribution: contributionSlice,
  submission: submissionSlice,
  noti: notiSlice,
  faculty: facultySlice,
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
