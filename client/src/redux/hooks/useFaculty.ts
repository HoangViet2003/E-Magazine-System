import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import { setFaculties, setIsLoading } from "../slices/FacultySlice.js";
import axios from "../../utils/axios.js";
import {
  GET_API,
  PUT_API,
  DELETE_API,
  POST_API,
  PATCH_API,
} from "../../constants/api.js";
import { toast } from "react-toastify";

export const useFaculty = () => {
  const dispatch = useDispatch();
  const { faculties } = useSelector((state: RootState) => state.faculty);

  const getFaculties = async () => {
    try {
      const res = await axios.get(GET_API("").GET_ALL_FACULTIES);
      console.log(res.data.faculties);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      dispatch(setFaculties(res.data.faculties));
    } catch (error) {
      console.log(error);
    }
  };

  const createAccount = async (data: any) => {
    try {
      const res = await axios.post(POST_API().SIGNUP, data);
      console.log(res);
      if (res.status !== 201) {
        throw new Error(res.statusText);
      }
      toast.success("Account created successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const createFaculty = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await axios.post(POST_API().CREATE_FACULTY, data);
      if (res.status !== 201) {
        throw new Error(res.statusText);
      }
      toast.success("Faculty created successfully");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return {
    getFaculties,
    faculties,
    createAccount,
    createFaculty,
    deleteFaculty,
    updateFaculty,
  };
};
