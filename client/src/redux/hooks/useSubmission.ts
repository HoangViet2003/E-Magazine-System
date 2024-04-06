import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSubmission,
  setAllSubmissions,
  setLoadingSubmission,
  setSubmission,
} from "../slices/SubmissionSlice";
import {
  GET_API,
  PUT_API,
  DELETE_API,
  POST_API,
  PATCH_API,
} from "../../constants/api.js";
import axios from "../../utils/axios.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Article,
  addNewSubmissionArticle,
  removeSubmissionArticle,
} from "../slices/ArticleSlice.js";

export const useSubmission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, submissions, submission } = useSelector(
    (state: RootState) => state.submission,
  );

  const getSubmissionsByContributionId = async (contributionId: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      if (!contributionId) {
        throw new Error("Contribution ID is required.");
      }

      const { data, status } = await axios.get(
        GET_API(contributionId).GET_SUBMISSION_BY_CONTRIBUTION_ID,
      );

      if (status !== 200) {
        throw new Error("Error fetching submissions");
      }
      dispatch(setAllSubmissions(data?.submissions));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const getSubmissionByStudent = async (contributionId: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      if (!contributionId) {
        throw new Error("Contribution ID is required.");
      }

      const { data, status } = await axios.get(
        GET_API(contributionId).GET_SUBMISSION_BY_STUDENT_ID,
      );

      if (status !== 200) {
        throw new Error("Error fetching submissions");
      }

      dispatch(setSubmission(data?.submission));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const getSubmissionByStudentToNavigate = async (contributionId: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      const { data, status } = await axios.get(
        GET_API(contributionId).GET_SUBMISSION_BY_CONTRIBUTION_ID_FOR_STUDENT,
      );
      if (status !== 200) {
        throw new Error("Error fetching submission");
      }

      dispatch(setSubmission(data?.submission));
      navigate(`submission/${data?.submission._id}`);
    } catch (error) {
      navigate("submission");
    } finally {
      searchParams.set("contributionId", contributionId);
      setSearchParams(searchParams);

      dispatch(setLoadingSubmission(false));
    }
  };

  const getSubmissionById = async (submissionId: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      if (!submissionId) {
        throw new Error("Contribution ID is required.");
      }

      const selectedSubmission =
        submissions.length > 0
          ? submissions.filter(
              (submission) => submission._id === submissionId,
            )[0]
          : undefined;

      if (selectedSubmission) dispatch(setSubmission(selectedSubmission));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const createSubmissionForStudent = async (contributionId: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      const { data, status } = await axios.post(POST_API("").CREATE_SUBMISSION);

      if (status !== 200 && status !== 201) {
        throw new Error("Error creating submissions");
      }

      dispatch(setSubmission(data));
      navigate(`${data?.newSubmission._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      searchParams.set("contributionId", contributionId);
      setSearchParams(searchParams);

      dispatch(setLoadingSubmission(false));
    }
  };

  const getSubmissionByContributionStudent = async (contributionId: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      if (!contributionId) {
        throw new Error("Contribution ID is required.");
      }

      const { data, status } = await axios.get(
        GET_API(contributionId).GET_SUBMISSION_BY_CONTRIBUTION_ID_FOR_STUDENT,
      );

      if (status !== 200) {
        throw new Error("Error fetching submissions");
      }
      dispatch(setSubmission(data?.submission));
    } catch (error) {
      // console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const addSelectedArticlesToSubmission = async (
    submissionId?: string,
    articles?: Article[],
  ) => {
    dispatch(setLoadingSubmission(true));

    const articlesId: string[] = articles?.map((article) => article._id) ?? [];

    try {
      if (!articlesId || articlesId.length === 0)
        throw new Error("Article Ids are required.");

      if (!submissionId) throw new Error("Submission Id is required!");

      const { data, status } = await axios.put(
        PUT_API(submissionId).ADD_ARTICLES_TO_SUBMISSION,
        {
          newArticleIds: articlesId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (status !== 200) {
        throw new Error("Error adding articles to submission");
      }

      articles?.map((article) => {
        dispatch(addNewSubmissionArticle(article));
      });
      dispatch(setSubmission(data?.updatedSubmission));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const createSubmissionForStudentThenAddSelectedArticles = async (
    contributionId: string,
    articles: Article[],
  ) => {
    dispatch(setLoadingSubmission(true));

    const articlesId: string[] = articles.map((article) => article._id);

    try {
      if (!articlesId || articlesId.length === 0)
        throw new Error("Articles Id is required.");

      const { data: createData, status: createSubmissionStatus } =
        await axios.post(POST_API("").CREATE_SUBMISSION);

      if (createSubmissionStatus !== 200 && createSubmissionStatus !== 201) {
        throw new Error("Error creating submissions");
      }

      dispatch(setSubmission(createData));

      const { status: addArticleStatus } = await axios.put(
        PUT_API(createData?.newSubmission._id).ADD_ARTICLES_TO_SUBMISSION,
        {
          newArticleIds: articlesId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (addArticleStatus !== 200) {
        throw new Error("Error adding articles to submission");
      }

      navigate(`${createData?.newSubmission._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      searchParams.set("contributionId", contributionId);
      setSearchParams(searchParams);

      dispatch(setLoadingSubmission(false));
    }
  };

  const createSubmissionForStudentThenAddUploadedFiles = async (
    contributionId: string,
    formData: FormData,
  ) => {
    dispatch(setLoadingSubmission(true));

    try {
      const { data: createData, status: createSubmissionStatus } =
        await axios.post(POST_API("").CREATE_SUBMISSION);

      if (createSubmissionStatus !== 200 && createSubmissionStatus !== 201) {
        throw new Error("Error creating submissions");
      }

      dispatch(setSubmission(createData));

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

      const articlesId: string[] = uploadData.article.map(
        (article: Article) => article._id,
      );

      const { status: addArticleStatus } = await axios.put(
        PUT_API(createData?.newSubmission._id).ADD_ARTICLES_TO_SUBMISSION,
        {
          newArticleIds: articlesId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (addArticleStatus !== 200) {
        throw new Error("Error adding articles to submission");
      }

      navigate(`${createData?.newSubmission._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      searchParams.set("contributionId", contributionId);
      setSearchParams(searchParams);

      dispatch(setLoadingSubmission(false));
    }
  };

  const toggleForSubmit = async (submissionId?: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      if (!submissionId) {
        throw new Error("Submission Id is required!");
      }

      const { data, status } = await axios.patch(
        PATCH_API(submissionId).TOGGLE_SUBMIT,
      );

      if (status !== 200) {
        throw new Error("Error toggling submission");
      }

      dispatch(setSubmission(data.updatedSubmission));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const deleteSubmission = async (submissionId?: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      if (!submissionId) {
        throw new Error("Submission Id is required");
      }

      const { status } = await axios.delete(
        DELETE_API(submissionId).DELETE_SUBMISSION,
      );

      if (status !== 200) {
        throw new Error("Error deleting submission");
      }

      dispatch(resetSubmission());
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const removeArticlesFromSubmission = async (
    submissionId?: string,
    selectedArticles?: Article[],
  ) => {
    dispatch(setLoadingSubmission(true));

    const articlesId: string[] =
      selectedArticles?.map((article) => article._id) ?? [];

    try {
      if (!submissionId) {
        throw new Error("Submission Id is required");
      }

      if (!articlesId || articlesId.length === 0)
        throw new Error("Articles Id is required.");

      const { data, status } = await axios.put(
        PUT_API(submissionId).REMOVE_ARTICLES_FROM_SUBMISSION,
        {
          articleIds: articlesId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (status !== 200) {
        throw new Error("Error deleting submission");
      }

      dispatch(setSubmission(data?.updatedSubmission));
      dispatch(removeSubmissionArticle(articlesId));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const toggleSelectSubmission = async (submissionId?: string) => {
    dispatch(setLoadingSubmission(true));

    try {
      if (!submissionId) throw new Error("SubmissionId is required!");

      const { data, status } = await axios.patch(
        PATCH_API(submissionId).TOGGLE_PUBLICATION,
      );

      if (status !== 200)
        throw new Error("Error toggle submission for publication");

      dispatch(setSubmission(data?.updatedSubmission));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  return {
    isLoading,
    submission,
    submissions,
    getSubmissionsByContributionId,
    getSubmissionByStudentToNavigate,
    getSubmissionByStudent,
    getSubmissionById,
    createSubmissionForStudent,
    getSubmissionByContributionStudent,
    addSelectedArticlesToSubmission,
    createSubmissionForStudentThenAddSelectedArticles,
    createSubmissionForStudentThenAddUploadedFiles,
    toggleForSubmit,
    deleteSubmission,
    removeArticlesFromSubmission,
    toggleSelectSubmission,
  };
};
