import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllContribution,
  setContribution,
  setLoadingContribution,
} from "../slices/ContributionSlice";
import axios from "../../utils/axios.js";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";

export const useContribution = () => {
  const dispatch = useDispatch();
  const { isLoading, contributions, contribution } = useSelector(
    (state: RootState) => state.contribution,
  );

  const fetchAllContribution = async () => {
    dispatch(setLoadingContribution(true));

    try {
      const { data, status } = await axios.get(
        GET_API("").GET_ALL_CONTRIBUTIONS_BY_COORDINATOR,
      );

      if (status !== 200) {
        throw new Error("Error fetching contributions");
      }

      dispatch(setAllContribution(data?.contributions));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  const getContributionById = async (contributionId?: string) => {
    dispatch(setLoadingContribution(true));

    try {
      if (!contributionId) throw new Error("ContributionId is required!");

      const { data, status } = await axios.get(
        GET_API(contributionId).GET_CONTRIBUTION_BY_ID,
      );

      if (status !== 200) {
        throw new Error("Error get contribution");
      }

      dispatch(setContribution(data?.contribution));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  return {
    isLoading,
    contribution,
    contributions,
    fetchAllContribution,
    getContributionById,
  };
};
