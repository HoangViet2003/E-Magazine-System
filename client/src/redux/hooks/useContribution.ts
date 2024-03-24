import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Contribution,
  setAllContributions,
  setLoadingContribution,
} from "./../slices/ContributionSlice";
import { RootState } from "../index";

const url = "https://e-magazine.onrender.com/api/v1/";
const token = localStorage.getItem("token");

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
        url: `${url}/article/faculty/65fd4994b9790ad205e7ca7e`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);

      if (status !== 200) {
        throw new Error("Error fetching contributions");
      }

      dispatch(setAllContributions(data?.articles));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  const searchContributionQuery = async (query: string) => {
    dispatch(setLoadingContribution(true));
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
        throw new Error("Error fetching contributions");
      }

      dispatch(setAllContributions(data?.articles));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  return {
    loading,
    contributions,
    fetchAllContribution,
    searchContributionQuery,
  };
};
