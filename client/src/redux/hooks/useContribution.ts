import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Contribution,
  setAllContributions,
  setLoadingContribution,
} from "./../slices/ContributionSlice";
import { RootState } from "./../index";

const url = "https://e-magazine.onrender.com/api/v1/";
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
        url: `${url}/contributions`,
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });


      if (status !== 200) {
        throw new Error("Error fetching contributions");
      }

      dispatch(setAllContributions(data?.data));
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
