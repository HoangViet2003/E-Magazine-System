import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllSubmissions,
  setLoadingSubmission,
  setSubmission,
} from "../slices/SubmissionSlice";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import axios from "../../utils/axios.js";

export const useSubmission = () => {
  const dispatch = useDispatch();
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
      // return data?.submissions;
      dispatch(setAllSubmissions(data?.submissions));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  const getSubmissionByStudent = async () => {
    dispatch(setLoadingSubmission(true));

    try {
      const { data, status } = await axios.get(
        GET_API("").GET_SUBMISSION_BY_STUDENT_ID,
      );

      if (status !== 200) {
        throw new Error("Error fetching submissions");
      }

      console.log(data);  


      dispatch(setSubmission(data?.submission));
    } catch (error) {
      console.log(error);
    } finally {
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

  return {
    isLoading,
    submission,
    submissions,
    fetchAllSubmission,
    getSubmissionsByContributionId,
    getSubmissionByStudent,
    getSubmissionById,
  };
};
