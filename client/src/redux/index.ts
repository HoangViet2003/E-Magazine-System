import { configureStore } from "@reduxjs/toolkit";

import contributionSlice from "./slices/ContributionSlice";

const rootReducer = {
  contribution: contributionSlice,
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
