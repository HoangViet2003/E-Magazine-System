import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllSubmissions,
  setLoadingSubmission,
  setSubmission,
} from "../slices/SubmissionSlice";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import axios from "../../utils/axios.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Article } from "../slices/ArticleSlice.js";

export const useSubmission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, submissions, submission } = useSelector(
    (state: RootState) => state.submission,
  );

  const fetchAllSubmission = async () => {
    dispatch(setLoadingSubmission(true));
    try {
      const { data, status } = await axios.get(GET_API("").GET_ALL_SUBMISSIONS);

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      dispatch(setAllSubmissions(data?.submissions));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

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

      dispatch(setLoadingSubmission(data));
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
      dispatch(setSubmission(data));
    } catch (error) {
      // console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const addSelectedArticlesToSubmission = async (
    submissionId: string,
    articles: Article[],
  ) => {
    dispatch(setLoadingSubmission(true));

    const articlesId: string[] = articles.map((article) => article._id);

    try {
      if (!articlesId || articlesId.length === 0)
        throw new Error("Articles Id is required.");

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

      console.log(data);

      if (status !== 200) {
        throw new Error("Error adding articles to submission");
      }
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
    fetchAllSubmission,
    getSubmissionsByContributionId,
    getSubmissionByStudentToNavigate,
    getSubmissionByStudent,
    getSubmissionById,
    createSubmissionForStudent,
    getSubmissionByContributionStudent,
    addSelectedArticlesToSubmission,
  };
};
