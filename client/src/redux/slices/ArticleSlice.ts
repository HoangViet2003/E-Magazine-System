import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./UserSlice";

export interface Article {
  _id: string;
  title: string;
  facultyId?: string;
  student?: User;
  updatedAt: string;
  createdAt: string;
  content: string[];
  type: string;
}

interface ArticleState {
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalLength: number;
  articles: Article[];
  article: Article;
  submissionArticles: Article[];
  keyword?: string;
  isFilterMode: boolean;
}

const initialState: ArticleState = {
  articles: [],
  submissionArticles: [],
  article: {
    _id: "",
    title: "",
    facultyId: "",
    student: {
      _id: "",
      name: "",
      email: "",
      facultyId: "",
    },
    updatedAt: "",
    createdAt: "",
    content: [],
    type: "",
  },
  isLoading: false,
  currentPage: 1,
  totalPages: 0,
  totalLength: 0,
  keyword: "",
  isFilterMode: false,
};

const ArticleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setLoadingArticle(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAllArticles(state, action: PayloadAction<ArticleState>) {
      state.articles = action.payload.articles;
      state.totalLength = action.payload.totalLength;
      state.totalPages = action.payload.totalPages;
    },
    setArticle(state, action: PayloadAction<Article>) {
      state.article = action.payload;
    },
    addNewArticle(
      state,
      action: PayloadAction<{ article: Article; user: User }>,
    ) {
      action.payload.article = {
        ...action.payload.article,
        student: action.payload.user,
      };

      state.articles.push(action.payload.article);
    },
    setSubmissionArticles(state, action: PayloadAction<ArticleState>) {
      state.submissionArticles = action.payload.articles;
      state.totalLength = action.payload.totalLength;
      state.totalPages = action.payload.totalPages;
    },
    resetSubmissionArticles(state) {
      state.submissionArticles = [];
      state.totalLength = 0;
      state.totalPages = 0;
    },
    setKeyword(state, action: PayloadAction<string>) {
      state.keyword = action.payload;
    },
    setIsFilterMode(state, action: PayloadAction<boolean>) {
      state.isFilterMode = action.payload;
    },
  },
});

const { reducer, actions } = ArticleSlice;

export const {
  setLoadingArticle,
  setAllArticles,
  setArticle,
  addNewArticle,
  setKeyword,
  setIsFilterMode,
  setSubmissionArticles,
  resetSubmissionArticles,
} = actions;

export default reducer;
