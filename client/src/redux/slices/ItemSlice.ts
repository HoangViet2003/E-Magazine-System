import { createSlice } from "@reduxjs/toolkit";

interface Item {
  _id: string;
  name: string;
  description: string;
}

interface ItemState {
  items: Item[];
  item: Item;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalLength: number;
}

const initialState: ItemState = {
  items: [],
  loading: false,
  currentPage: 1,
  totalPages: 0,
  totalLength: 0,
  item: {
    _id: "",
    name: "",
    description: "",
  },
};

const slice = createSlice({
  name: "item",
  initialState,
  reducers: {},
});

const { reducer, actions } = slice;

export const {} = actions;

export type { ItemState, Item };

export default reducer;
