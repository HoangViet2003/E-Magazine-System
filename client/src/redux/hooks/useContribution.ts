import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Contribution,
  setAllContributions,
} from "./../slices/ContributionSlice";
import { RootState } from "./../index";
import { setLoadingContribution } from "../slices/ContributionSlice";

const url = "";
const token = "";

export const useContribution = () => {
  const dispatch = useDispatch();

  const { loading, contributions } = useSelector(
    (state: RootState) => state.contribution,
  );

  const fetchAllContribution = async () => {
    dispatch(setLoadingContribution(true));
    try {
      const { data, status } = await axios({
        method: "get",
        url: `${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (status !== 200) {
        throw new Error("Error fetching contributions");
      }

      dispatch(
        setAllContributions(
          data?.contributions.map(
            (contribution: Contribution) => contribution || [],
          ),
        ),
      );
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  return {
    loading,
    contributions,
    fetchAllContribution,
  };
};
