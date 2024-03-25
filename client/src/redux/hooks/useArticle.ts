import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllArticles, setLoadingArticle } from "../slices/ArticleSlice";
import { RootState } from "../index";

const url = "https://e-magazine.onrender.com/api/v1/";
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
        url: `${url}/article/faculty/65fd4994b9790ad205e7ca7e`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      dispatch(setAllArticles(data?.articles));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingArticle(false));
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

      console.log(data);

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
    searchArticleQuery,
  };
};
