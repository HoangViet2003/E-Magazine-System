import { configureStore } from "@reduxjs/toolkit";

import articleSlice from "./slices/ArticleSlice";
import contributionSlice from "./slices/ContributionSlice";
import userSlice from "./slices/UserSlice";
import submissionSlice from "./slices/SubmissionSlice";

const rootReducer = {
  user: userSlice,
  article: articleSlice,
  contribution: contributionSlice,
  submission: submissionSlice,
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
