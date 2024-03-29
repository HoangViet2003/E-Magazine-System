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
        GET_API("").GET_ALL_CONTRIBUTIONS,
      );

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      dispatch(setAllContribution(data?.data));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  const setContributionById = async (contributionId: string) => {
    dispatch(setLoadingContribution(true));

    try {
      if (!contributionId) {
        throw new Error("Contribution ID is required.");
      }

      const selectedContribution =
        contributions.length > 0
          ? contributions.filter(
              (contribution) => contribution._id === contributionId,
            )[0]
          : undefined;

      if (selectedContribution) dispatch(setContribution(selectedContribution));
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
    setContributionById,
  };
};
