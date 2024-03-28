import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllSubmissions,
  setLoadingSubmission,
} from "../slices/SubmissionSlice";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import axios from "../../utils/axios.js";

const url = "https://e-magazine.onrender.com/api/v1";
const token = localStorage.getItem("token");

export const useSubmission = () => {
  const dispatch = useDispatch();
  const { isLoading, submissions } = useSelector(
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

  const getSubmissionByContributionId = async (contributionId: string) => {
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
      return data?.submissions;
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
      return data?.submission;
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingSubmission(false));
    }
  };

  return {
    isLoading,
    submissions,
    fetchAllSubmission,
    getSubmissionByContributionId,
    getSubmissionByStudent,
  };
};
