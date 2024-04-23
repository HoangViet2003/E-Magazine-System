import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllContribution,
  setAllManagerContribution,
  setContribution,
  setLoadingContribution,
  setCurrentPage,
  setTotalPage,
  setTotalLength,
} from "../slices/ContributionSlice";
import axios from "../../utils/axios.js";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useContribution = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    contributions,
    contribution,
    managerContributions,
    totalLength,
    totalPage,
    currentPage,
  } = useSelector((state: RootState) => state.contribution);

  const navigate = useNavigate();

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

  const fetchAllContributionByManager = async (page:number) => {
    dispatch(setLoadingContribution(true));

    try {
      const { data, status } = await axios.get(
        GET_API("",page).GET_ALL_CONTRIBUTIONS,
      );

      if (status !== 200) {
        throw new Error("Error fetching contributions");
      }
      console.log(data)

      dispatch(setAllContribution(data?.contributions));
      dispatch(setTotalPage(data?.totalPage));
      dispatch(setTotalLength(data?.totalLength));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  const fetchAllContributionByAcademicYear = async (academicYear?: number) => {
    dispatch(setLoadingContribution(true));

    try {
      if (!academicYear) throw new Error("academicYear value is required");

      const { data, status } = await axios.get(
        GET_API("", 1, academicYear).GET_ALL_CONTRIBUTIONS_BY_ACADEMIC_YEAR,
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
      if (res.status !== 201) {
        throw new Error(res.statusText);
      }

      if (
        res.data.message ===
        "All faculties already have contributions for the academic year."
      ) {
        toast.error(
          "All faculties already have contributions for the academic year.",
        );
        return;
      }

      toast.success("Contribution created successfully");
    } catch (error) {
      console.log(error);
    }
  };


  const deleteContribution = async (academicYear: string) => {
    dispatch(setLoadingContribution(true));

    try {
      const res = await axios.delete(
        DELETE_API('').DELETE_CONTRIBUTION,
        { data: { academicYear:academicYear } },
      );

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      toast.success("Contribution deleted successfully");
      fetchAllContribution();
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  }

  const updateContribution = async (data: any) => {
    dispatch(setLoadingContribution(true));

    try {
      const res = await axios.put(
        PUT_API('').UPDATE_CONTRIBUTION,
        data,
      );

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      toast.success("Contribution updated successfully");
      navigate("/contribution");
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  }

  const searchContribution = async (page: number, keyword: string) => {
    dispatch(setLoadingContribution(true));

    try {
      const res = await axios.get(
        `${GET_API("", page).SEARCH_CONTRIBUTION}&keyword=${keyword}`,
      );

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      dispatch(setAllContribution(res.data.contributions));
      dispatch(setTotalPage(res.data.totalPage));
      dispatch(setTotalLength(res.data.totalLength));
      dispatch(setLoadingContribution(false));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingContribution(false));
  };

  const handleCurrentPage = (page: number) => {
    dispatch(setCurrentPage(page));
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
    totalPage,
    totalLength,
    currentPage,
    handleCurrentPage,
    searchContribution,
    deleteContribution,
    updateContribution
  };
};
