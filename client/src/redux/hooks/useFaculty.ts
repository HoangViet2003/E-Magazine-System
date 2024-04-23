import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setFaculties,
  setIsLoading,
  setTotalPage,
  setTotalLength,
  setCurrentPage,
  setFaculty,

} from "../slices/FacultySlice.js";
import axios from "../../utils/axios.js";
import {
  GET_API,
  PUT_API,
  DELETE_API,
  POST_API,
  PATCH_API,
} from "../../constants/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useFaculty = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { facultyId } = JSON.parse(localStorage.getItem("user") || "{}");
  const { faculties, faculty,totalPages,totalLength,currentPage,isLoading } = useSelector(
    (state: RootState) => state.faculty,
  );

  const getFaculties = async (page = 1) => {
    dispatch(setIsLoading(true));
    try {
      const res = await axios.get(GET_API("",page).GET_ALL_FACULTIES);
      console.log(res.data.faculties);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      dispatch(setFaculties(res.data.faculties));
       dispatch(setTotalPage(res.data.totalPage));
       dispatch(setTotalLength(res.data.totalLength));
       dispatch(setIsLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setIsLoading(false));
    }
  };

  const getFacultyById = async () => {
    setIsLoading(true);

    try {
      const { data, status } = await axios.get(
        GET_API(facultyId).GET_FACULTY_BY_ID,
      );

      if (status !== 200) throw new Error("Error fetching faculty");

      dispatch(setFaculty(data));
    } catch (error) {
      console.log(error);
    }
  };

  const createAccount = async (data: any) => {
    console.log(data);
    try {
      const res = await axios.post(POST_API().SIGNUP, data);
      console.log(res);
      if (res.status !== 201) {
        throw new Error(res.statusText);
      }
      navigate("/account");
      toast.success("Account created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Account creation failed");
    }
  };

  const createFaculty = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await axios.post(POST_API().CREATE_FACULTY, data);
      console.log(res);
      if (res.status !== 201) {
        throw new Error(res.statusText);
      }
      toast.success("Faculty created successfully");
      navigate("/faculty");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Faculty creation failed");
      setIsLoading(false);
    }
  };

  const deleteFaculty = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(DELETE_API(id).DELETE_FACULTY);
      console.log(res);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      navigate("/faculty");
      toast.success("Faculty deleted successfully");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const updateFaculty = async (id: string, data: any) => {
    setIsLoading(true);

    try {
      const res = await axios.patch(PATCH_API(id).EDIT_FACULTY, data);
      console.log(res);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      toast.success("Faculty updated successfully");
      navigate("/faculty");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSelectedReport = async (selectedReports: string[]) => {
    setIsLoading(true);

    try {
      const { data, status } = await axios.patch(
        PATCH_API(facultyId).EDIT_FACULTY,
        {
          selectedReports: selectedReports,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (status !== 200) {
        throw new Error("Unable to set selected report");
      }

      console.log(data);

      toast.success("Faculty updated successfully");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSearchFaculty = async (keyword: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${GET_API("",currentPage).SEARCH_FACULTY}&keyword=${keyword}`);
      console.log(res);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      dispatch(setFaculties(res.data.faculties));
      dispatch(setTotalLength(res.data.totalLength));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

    const handleCurrentPage = (page: number) => {
      dispatch(setCurrentPage(page));
    };

  return {
    faculty,
    faculties,
    getFaculties,
    getFacultyById,
    createAccount,
    createFaculty,
    deleteFaculty,
    updateFaculty,
    totalPages,
    totalLength,
    handleCurrentPage,
    currentPage,
    isLoading,
    handleSearchFaculty,
    handleSelectedReport

  };
};
