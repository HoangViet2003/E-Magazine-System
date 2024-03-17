import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const fakeFolder = [
  {
    _id: "1",
    title: "2024 Contributions",
    isOpen: true,
    year: 2024,
  },
  {
    _id: "2",
    title: "2023 Contributionssdfsdfsdsfdfdf",
    isOpen: false,
    year: 2023,
  },
  {
    _id: "3",
    title: "2022 Contributions",
    isOpen: false,
    year: 2022,
  },
  {
    _id: "4",
    title: "2021 Contributions",
    isOpen: false,
    year: 2021,
  },
];

export interface Folder {
  _id: string;
  title: string;
  isOpen: boolean;
  year: number;
}

interface FolderState {
  loading: boolean;
  folders: Folder[];
}

const initialState: FolderState = {
  loading: false,
  folders: fakeFolder,
};

const FolderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    setLoadingFolder(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

const { reducer, actions } = FolderSlice;

export const { setLoadingFolder } = actions;

export default reducer;
