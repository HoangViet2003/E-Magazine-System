import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllArticles, setLoadingArticle } from "../slices/ArticleSlice";
import { RootState } from "../index";

const url = "https://e-magazine.onrender.com/api/v1";
const token = localStorage.getItem("token");

export const useArticle = () => {
  const dispatch = useDispatch();

  const { isLoading, articles } = useSelector(
    (state: RootState) => state.article,
  );

  const fetchAllArticle = async () => {
    dispatch(setLoadingArticle(true));
    try {
      const { data, status } = await axios({
        method: "get",
        url: `${url}/article/faculty/65ffed86f65b006fda7d0c9a`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      dispatch(setAllArticles(data?.articles));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingArticle(false));
  };

  const getArticlesBySubmissionId = async (submissionId?: string) => {
    dispatch(setLoadingArticle(true));

    try {
      if (!submissionId) {
        throw new Error("Submission ID is required.");
      }

      const { data, status } = await axios({
        method: "get",
        url: `${url}/article/submission/${submissionId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const searchArticleQuery = async (query: string) => {
    dispatch(setLoadingArticle(true));
    try {
      const { data, status } = await axios({
        method: "get",
        url: `${url}/article/search?query=${query}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  };
};
