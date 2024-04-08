import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./UserSlice";
import { PAGE_SIZE } from "../../utils/constant";

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
  article: Article;
  articles: Article[];
  suggestionArticles: Article[];
  selectedArticles: Article[];
  submissionArticles: Article[];
  unSubmissionArticles: Article[];
  keyword?: string;
  isFilterMode: boolean;
  isSearchMode: boolean;
}

const initialState: ArticleState = {
  articles: [],
  suggestionArticles: [],
  submissionArticles: [],
  selectedArticles: [],
  unSubmissionArticles: [],
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
  isSearchMode: false,
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

      state.articles.unshift(action.payload.article);
    },
    setSubmissionArticles(state, action: PayloadAction<ArticleState>) {
      state.submissionArticles = action.payload.articles;
      state.totalLength = action.payload.totalLength;
      state.totalPages = action.payload.totalPages;
    },
    setUnSubmissionArticles(state, action: PayloadAction<Article[]>) {
      state.unSubmissionArticles = action.payload;
    },
    addNewSubmissionArticle(state, action: PayloadAction<Article>) {
      state.submissionArticles.unshift(action.payload);
      if (state.submissionArticles.length > PAGE_SIZE) {
        state.submissionArticles.pop();
      }
      state.totalLength++;
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
    setSuggestionArticles(state, action: PayloadAction<Article[]>) {
      state.suggestionArticles = action.payload;
    },
    removeSubmissionArticle(state, action: PayloadAction<string[]>) {
      state.submissionArticles = state.submissionArticles.filter(
        (article) => !action.payload.includes(article._id),
      );
    },
    setSearchMode(state, action: PayloadAction<boolean>) {
      state.isSearchMode = action.payload;
    },
    resetSelectedArticles(state) {
      state.selectedArticles = [];
    },
    updateSelectedArticle(state, action: PayloadAction<Article>) {
      const isDataAlreadySelected = state.selectedArticles.some(
        (article) => article._id === action.payload._id,
      );

      if (!isDataAlreadySelected) {
        state.selectedArticles.push(action.payload);
      } else {
        state.selectedArticles = state.selectedArticles.filter(
          (article) => article._id !== action.payload._id,
        );
      }
    },
  },
});

const { reducer, actions } = ArticleSlice;

export const {
  setLoadingArticle,
  setAllArticles,
  setArticle,
  addNewArticle,
  addNewSubmissionArticle,
  setKeyword,
  setIsFilterMode,
  setSubmissionArticles,
  resetSubmissionArticles,
  setSuggestionArticles,
  resetSelectedArticles,
  removeSubmissionArticle,
  setSearchMode,
  setUnSubmissionArticles,
  updateSelectedArticle,
} = actions;

export default reducer;
