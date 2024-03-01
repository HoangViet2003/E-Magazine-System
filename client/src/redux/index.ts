import { configureStore } from "@reduxjs/toolkit";

// import itemReducer from "./slices/ItemSlice";

const rootReducer = {
  // item: itemReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
