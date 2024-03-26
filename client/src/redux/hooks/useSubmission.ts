import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllSubmissions,
  setLoadingSubmission,
} from "../slices/SubmissionSlice";
import axios from "axios";

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
      const { data, status } = await axios({
        method: "get",
        url: `${url}/submissions`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const getSubmissionByContributionId = async (contributionId) => {
    dispatch(setLoadingSubmission(true));

    try {
      if (!contributionId) {
        throw new Error("Contribution ID is required.");
      }

      const { data, status } = await axios({
        method: "get",
        url: `${url}/submissions/contribution/${contributionId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(data);

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

  return {
    isLoading,
    submissions,
    fetchAllSubmission,
    getSubmissionByContributionId,
  };
};
