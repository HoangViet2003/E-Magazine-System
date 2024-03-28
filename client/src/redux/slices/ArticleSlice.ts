import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./UserSlice";

// const fakeData = [
//   {
//     _id: "1",
//     name: "Behind The Curtain _ Theatre Production Backstage...",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Tuan Anh",
//     updatedAt: "2024-03-05T00:41:05.610635+00:00",
//     createdAt: "2024-03-05T00:41:05.610635+00:00",
//   },
//   {
//     _id: "2",
//     name: "Shining Star _ Jane Doe Student Profile.docx",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Tuan Anh",
//     updatedAt: "2024-02-05T00:41:05.610635+00:00",
//     createdAt: "2024-02-05T00:41:05.610635+00:00",
//   },
//   {
//     _id: "3",
//     name: "Tech Wave 2024 _ Trends Reshaping Student.docx",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Nguyen Thi Thu Ha",
//     updatedAt: "2024-04-05T00:41:05.610635+00:00",
//     createdAt: "2024-04-05T00:41:05.610635+00:00",
//   },
//   {
//     _id: "4",
//     name: "Around The World Plates _ Culinary Adventures Exch...",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Tuan Anh",
//     updatedAt: "2024-09-05T00:41:05.610635+00:00",
//     createdAt: "2024-09-05T00:41:05.610635+00:00",
//   },
//   {
//     _id: "5",
//     name: "Ink And Imagination _ Creative Writing Workshop Reference",
//     profile: ProfileImg,
//     action: "Selected for contribute",
//     owner: "Tuan Anh",
//     updatedAt: "2024-11-05T00:41:05.610635+00:00",
//     createdAt: "2024-11-05T00:41:05.610635+00:00",
//   },
// ];

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
}

const initialState: ArticleState = {
  articles: [],
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
  },
});

const { reducer, actions } = ArticleSlice;

export const { setLoadingArticle, setAllArticles, setArticle, addNewArticle } =
  actions;

export default reducer;
