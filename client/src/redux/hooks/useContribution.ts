import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllContribution,
  setLoadingContribution,
} from "../slices/ContributionSlice";
import axios from "axios";

const url = "https://e-magazine.onrender.com/api/v1";
const token = localStorage.getItem("token");

export const useContribution = () => {
  const dispatch = useDispatch();
  const { isLoading, contributions } = useSelector(
    (state: RootState) => state.contribution,
  );

  const fetchAllContribution = async () => {
    dispatch(setLoadingContribution(true));

    try {
      const { data, status } = await axios({
        method: "get",
        url: `${url}/contributions`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (status !== 200) {
        throw new Error("Error fetching articles");
      }

      dispatch(setAllContribution(data?.data));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  return {
    isLoading,
    contributions,
    fetchAllContribution,
  };
};
