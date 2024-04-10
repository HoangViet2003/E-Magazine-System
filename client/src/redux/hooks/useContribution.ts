import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllContribution,
  setAllManagerContribution,
  setContribution,
  setLoadingContribution,
} from "../slices/ContributionSlice";
import axios from "../../utils/axios.js";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import { toast } from "react-toastify";

export const useContribution = () => {
  const dispatch = useDispatch();
  const { isLoading, contributions, contribution, managerContributions } =
    useSelector((state: RootState) => state.contribution);

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

  const fetchAllContributionByManager = async () => {
    dispatch(setLoadingContribution(true));

    try {
      const { data, status } = await axios.get(
        GET_API("").GET_ALL_CONTRIBUTIONS,
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

  const fetchAllContributionByAcademicYear = async (year?: number) => {
    dispatch(setLoadingContribution(true));

    try {
      if (!year) throw new Error("Year value is required");

      const { data, status } = await axios.get(
        GET_API("", 1, year).GET_ALL_CONTRIBUTIONS_BY_ACADEMIC_YEAR,
      );

      if (status !== 200) throw new Error("Error fetching contributions");

      dispatch(setAllManagerContribution(data?.contributions));
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

  const createContributionForAllFaculty = async (data: any) => {
    console.log(data);

    try {
      const res = await axios.post(POST_API().CREATE_CONTRIBUTION, data);
      console.log(res);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      toast.success("Contribution created successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isLoading,
    contribution,
    contributions,
    managerContributions,
    fetchAllContribution,
    fetchAllContributionByManager,
    fetchAllContributionByAcademicYear,
    getContributionById,
    createContributionForAllFaculty,
  };
};
