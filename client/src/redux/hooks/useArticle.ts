import { useDispatch, useSelector } from "react-redux";
import { setAllArticles, setLoadingArticle } from "../slices/ArticleSlice";
import { RootState } from "../index";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import axios from "../../utils/axios.js";

export const useArticle = () => {
  const dispatch = useDispatch();

  const { isLoading, articles } = useSelector(
    (state: RootState) => state.article,
  );

  const fetchAllArticle = async () => {
    dispatch(setLoadingArticle(true));
    try {
      const id = "65ffed86f65b006fda7d0c9a";
      const { data, status } = await axios.get(
        GET_API(id).GET_ARTICLES_BY_FACULTY_ID,
      );

      console.log(status, "status");

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      dispatch(setAllArticles(data?.articles));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingArticle(false));
  };

  const getArticleByStudentId = async (page: any) => {
    dispatch(setLoadingArticle(true));

    try {
      const { data, status } = await axios.get(
        GET_API('',page).GET_ALL_STUDENT_ARTICLES
      );

      console.log(status, "status");

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      console.log(data);

      dispatch(setAllArticles(data?.articles));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const getArticlesBySubmissionId = async (submissionId?: string) => {
    dispatch(setLoadingArticle(true));

    try {
      if (!submissionId) {
        throw new Error("Submission ID is required.");
      }
      const { data, status } = await axios.get(
        GET_API(submissionId).GET_ARTICLES_BY_SUBMISSION_ID
      );

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      return data?.articles;
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const searchArticleQuery = async (query: string,page =1) => {
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

  return {
    isLoading,
    articles,
    fetchAllArticle,
    getArticlesBySubmissionId,
    searchArticleQuery,
    getArticleByStudentId,
  };
};
