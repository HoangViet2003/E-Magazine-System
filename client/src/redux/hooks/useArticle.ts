import axios from "../../utils/axios.js";
import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllArticles,
  setLoadingArticle,
  setArticle,
  addNewArticle,
  setSubmissionArticles,
  resetSubmissionArticles,
} from "../slices/ArticleSlice";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import { toast } from "react-toastify";
import { URL } from "../../utils/constant.js";
import "react-toastify/dist/ReactToastify.css";

export const useArticle = () => {
  const dispatch = useDispatch();

  const { isLoading, articles, totalLength, article, submissionArticles } =
    useSelector((state: RootState) => state.article);

  const { user } = useSelector((state: RootState) => state.user);

  const fetchAllArticle = async (page: number) => {
    dispatch(setLoadingArticle(true));
    try {
      const id = "65ffed86f65b006fda7d0c9a";
      const { data, status } = await axios.get(
        GET_API(id, page).GET_ARTICLES_BY_FACULTY_ID,
      );

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      dispatch(setAllArticles(data));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingArticle(false));
  };

  const getArticleByStudentId = async (page: number) => {
    dispatch(setLoadingArticle(true));

    try {
      const { data, status } = await axios.get(
        GET_API("", page).GET_ALL_STUDENT_ARTICLES,
      );

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      dispatch(setAllArticles(data));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const getArticlesBySubmissionId = async (
    submissionId: string,
    page?: number,
  ) => {
    dispatch(setLoadingArticle(true));

    try {
      if (submissionId) {
        const { data, status } = await axios.get(
          GET_API(submissionId, page).GET_ARTICLES_BY_SUBMISSION_ID,
        );

        if (status !== 200) {
          throw new Error("Error fetching articles");
        }

        dispatch(setSubmissionArticles(data));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const searchArticleQuery = async (query: string, page = 1) => {
    dispatch(setLoadingArticle(true));
    try {
      const { data, status } = await axios.get(
        `${GET_API("", page).GET_FACULTY_BY_ID}&title=${query}`,
      );

      if (status !== 200) {
        throw new Error("Error fetching Articles");
      }

      dispatch(setAllArticles(data?.articles));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingArticle(false));
  };

  const getArticleById = async (id: string) => {
    try {
      dispatch(setLoadingArticle(true));

      const { data, status } = await axios.get(GET_API(id).GET_ARTICLE_BY_ID);
      if (status !== 200) {
        throw new Error("Error fetching article");
      }

      console.log(data);

      dispatch(setArticle(data?.article));
    } catch (error) {
      console.error(error);
    }
    dispatch(setLoadingArticle(false));
  };

  const uploadArticle = async (formData: FormData) => {
    dispatch(setLoadingArticle(true));

    try {
      const { data, status } = await axios.post(
        POST_API("").UPLOAD_ARTICLE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (status !== 200 && status !== 201) {
        throw new Error("Error upload article");
      }

      dispatch(addNewArticle({ article: data?.article, user }));
      console.log("success");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const createNewDocument = async () => {
    dispatch(setLoadingArticle(true));

    try {
      const { data, status } = await axios.post(
        POST_API("").CREATE_BLANK_WORD_FILE,
      );

      if (status !== 200 && status !== 201) {
        throw new Error("Error create article");
      }

      dispatch(addNewArticle({ article: data?.article, user }));
      window.open(`${URL}/documents/${data?.article._id}`, "_blank");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const updateArticle = async (id: string, formData: FormData) => {
    dispatch(setLoadingArticle(true));

    try {
      const { status } = await axios.put(PUT_API(id).UPDATE_ARTICLE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (status !== 200) {
        throw new Error("Error updating article");
      }
      dispatch(setLoadingArticle(false));
      toast.success("Article updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating article");
    }
  };
  const resetSubmissionArticlesState = () => {
    dispatch(setLoadingArticle(true));
    dispatch(resetSubmissionArticles());

    dispatch(setLoadingArticle(false));
  };

  return {
    totalLength,
    isLoading,
    articles,
    submissionArticles,
    article,
    fetchAllArticle,
    getArticleById,
    getArticlesBySubmissionId,
    searchArticleQuery,
    getArticleByStudentId,
    updateArticle,
    uploadArticle,
    createNewDocument,
    resetSubmissionArticlesState,
  };
};
