import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
    setFaculties
} from "../slices/FacultySlice.js";
import axios from "../../utils/axios.js";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import { toast } from 'react-toastify';

export const useFaculty = () => {
  const dispatch = useDispatch();
  const {
    faculties
  } = useSelector((state: RootState) => state.faculty);

    const getFaculties = async () => {
        try {
        const res = await axios.get(GET_API("").GET_ALL_FACULTIES);
        console.log(res.data.data)
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }
        dispatch(setFaculties(res.data.data));
        } catch (error) {
        console.log(error);
        }
    };

    const createAccount = async (data :any) => {
        try {
        const res = await axios.post(POST_API().SIGNUP, data);
        console.log(res)
        if (res.status !== 201) {
            throw new Error(res.statusText);
        }
        toast.success('Account created successfully')
        } catch (error) {
        console.log(error);
        }
    };
 

  return {
    getFaculties,
    faculties,
    createAccount
  };
};
