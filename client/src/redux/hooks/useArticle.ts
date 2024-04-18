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
  setKeyword,
  setIsFilterMode,
  addNewSubmissionArticle,
  Article,
  setSelectedArticles,
  setSuggestionArticles,
  setSearchMode,
  setUnSubmissionArticles,
  updateSelectedArticle,
  resetSelectedArticles,
  setDashboard,
  deleteArticle,
} from "../slices/ArticleSlice";
import { setSubmission } from "../slices/SubmissionSlice.js";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import { toast } from "react-toastify";
import { URL } from "../../utils/constant.js";
import "react-toastify/dist/ReactToastify.css";

export const useArticle = () => {
  const dispatch = useDispatch();
  const { facultyId } = JSON.parse(localStorage.getItem("user") || "{}");

  const {
    isLoading,
    articles,
    totalLength,
    article,
    keyword,
    isFilterMode,
    selectedArticles,
    suggestionArticles,
    isSearchMode,
    submissionArticles,
    unSubmissionArticles,
    dashboard,
  } = useSelector((state: RootState) => state.article);

  const { user } = useSelector((state: RootState) => state.user);

  const fetchAllArticle = async (page: number) => {
    dispatch(setLoadingArticle(true));
    try {
      const { data, status } = await axios.get(
        GET_API(facultyId, page).GET_ARTICLES_BY_FACULTY_ID,
      );

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      console.log(data);

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

  const searchArticleQuery = async (
    query?: string,
    type?: string,
    page = 1,
  ) => {
    dispatch(setLoadingArticle(true));
    console.log(query);
    try {
      if (type) {
        dispatch(setIsFilterMode(true));
      }
      const { data, status } = await axios.get(
        `${GET_API("", page).GET_FILTERED_ARTICLES}?keyword=${query}`,
      );

      if (status !== 200) {
        throw new Error("Error fetching Articles");
      }

      dispatch(setAllArticles(data));
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
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const uploadArticleThenAddToSubmission = async (
    formData: FormData,
    submissionId: string,
  ) => {
    dispatch(setLoadingArticle(true));

    try {
      const { data: uploadData, status: uploadStatus } = await axios.post(
        POST_API("").UPLOAD_ARTICLE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (uploadStatus !== 200 && uploadStatus !== 201) {
        throw new Error("Error upload article");
      }

      const articlesIds: string[] = uploadData?.article.map(
        (article: Article) => article._id,
      );

      const { data: submissionData, status: submissionStatus } =
        await axios.put(
          PUT_API(submissionId).ADD_ARTICLES_TO_SUBMISSION,
          {
            newArticleIds: articlesIds,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

      if (submissionStatus !== 200) {
        throw new Error("Error adding articles to submission");
      }

      if (uploadData?.article && uploadData?.article.length > 0) {
        uploadData?.article.forEach((article: Article) => {
          dispatch(addNewSubmissionArticle(article));
        });
      }

      dispatch(setSubmission(submissionData?.updatedSubmission));

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
      const { status, data } = await axios.put(
        PUT_API(id).UPDATE_ARTICLE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (status !== 200) {
        throw new Error("Error updating article");
      }

      console.log(data);

      dispatch(setLoadingArticle(false));
      toast.success("Article updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating article");
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };
  const resetSubmissionArticlesState = () => {
    dispatch(resetSubmissionArticles());
  };

  const handleGetSuggestion = async (query: string) => {
    dispatch(setLoadingArticle(true));

    try {
      const { data, status } = await axios.get(
        `${GET_API("").GET_SUGGESTION_ARTICLES}?query=${query}`,
      );

      if (status !== 200) {
        throw new Error("Error fetching suggestions");
      }
      console.log(data.articles, "suggestion");
      dispatch(setSuggestionArticles(data.articles));
    } catch (error) {
      console.error(error);
      dispatch(setLoadingArticle(false));
    }
  };

  const handleSetKeyword = (keyword: string) => {
    dispatch(setKeyword(keyword));
  };

  const handleSetIsFilterMode = (isFilterMode: boolean) => {
    dispatch(setIsFilterMode(isFilterMode));
  };

  const getUnselectedArticleStudent = async (submissionId: string) => {
    dispatch(setLoadingArticle(true));

    try {
      if (!submissionId) throw new Error("Submission Id is required.");

      const { data, status } = await axios.get(
        GET_API(submissionId).GET_UNSELECTED_ARTICLES_OF_STUDENTS,
      );

      if (status !== 200) {
        throw new Error("Error fetching submissions");
      }

      dispatch(setUnSubmissionArticles(data?.articles));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const addSubmissionArticle = (articles: Article[]) => {
    if (articles && articles.length > 0) {
      articles.forEach((article) => {
        dispatch(addNewSubmissionArticle(article));
      });
    }
  };

  const resetSelectedArticlesState = () => {
    dispatch(resetSelectedArticles());
  };

  const updateSelectedArticleState = (articles: Article) => {
    if (articles) {
      dispatch(updateSelectedArticle(articles));
    }
  };

  const handleSetSearchMode = (isSearchMode: boolean) => {
    dispatch(setSearchMode(isSearchMode));
  };

  const handleSetDashBoard = async (academicYear?: number) => {
    dispatch(setLoadingArticle(true));

    try {
      const { data, status } = await axios.get(
        GET_API("", 1, academicYear).GET_DASHBOARD,
      );

      if (status !== 200) {
        throw new Error("Error fetching dashboard");
      }

      dispatch(setDashboard(data));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  const deleteArticleById = async (articleId: string) => {
    dispatch(setLoadingArticle(true));

    try {
      if (!articleId) throw new Error("ArticleId is required.");

      const { data, status } = await axios.delete(
        DELETE_API(articleId).DELETE_ARTICLE,
      );

      if (status !== 200) {
        throw new Error("Error deleting article");
      }

      dispatch(deleteArticle(data?.article));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingArticle(false));
    }
  };

  return {
    totalLength,
    isLoading,
    articles,
    dashboard,
    submissionArticles,
    unSubmissionArticles,
    selectedArticles,
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
    handleSetKeyword,
    keyword,
    isFilterMode,
    handleSetIsFilterMode,
    getUnselectedArticleStudent,
    uploadArticleThenAddToSubmission,
    addSubmissionArticle,
    resetSelectedArticlesState,
    handleGetSuggestion,
    suggestionArticles,
    handleSetSearchMode,
    isSearchMode,
    updateSelectedArticleState,
    handleSetDashBoard,
    setDashboard,
    deleteArticleById,
  };
};
