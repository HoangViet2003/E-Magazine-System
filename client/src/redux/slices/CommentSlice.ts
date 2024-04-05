import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./UserSlice";

export interface Comment {
  _id: string;
  content: string;
  replies?: string[];
  userId?: User;
  submissionId: string;
  createdAt: string;
  updatedAt?: string;
}

interface CommentState {
  isLoading: boolean;
  comment: Comment;
  comments: Comment[];
  totalPages: number;
  totalLength: number;
}

const initialState: CommentState = {
  isLoading: false,
  comments: [],
  comment: {
    _id: "",
    content: "",
    replies: [],
    userId: {
      _id: "",
      name: "",
      email: "",
    },
    submissionId: "",
    createdAt: "",
    updatedAt: "",
  },
  totalPages: 0,
  totalLength: 0,
};

const CommentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setLoadingComment(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAllComments(state, action: PayloadAction<CommentState>) {
      state.comments = action.payload.comments;
      state.totalLength = action.payload.totalLength;
      state.totalPages = action.payload.totalPages;
    },
    setComment(state, action: PayloadAction<Comment>) {
      state.comment = action.payload;
    },
    addNewComment(state, action: PayloadAction<Comment>) {
      state.comments.unshift(action.payload);
      state.totalLength++;
    },
    getMoreComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
    },
  },
});

const { reducer, actions } = CommentSlice;

export const {
  setLoadingComment,
  setAllComments,
  setComment,
  addNewComment,
  getMoreComment,
} = actions;

export default reducer;
