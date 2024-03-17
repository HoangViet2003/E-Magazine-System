import { configureStore } from "@reduxjs/toolkit";

import contributionSlice from "./slices/ContributionSlice";
import folderSlice from "./slices/FolderSlice";

const rootReducer = {
  contribution: contributionSlice,
  folder: folderSlice,
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
