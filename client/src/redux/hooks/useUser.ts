import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { User, setAllUsers, setLoadingUser } from "./../slices/UserSlice";
import { RootState } from "./../index";

const url = "https://e-magazine.onrender.com/api/v1/";
const token = "";

export const useContribution = () => {
  const dispatch = useDispatch();

  const { loading, contributions } = useSelector(
    (state: RootState) => state.contribution,
  );

  const fetchAllUser = async () => {
    dispatch(setLoadingUser(true));
    try {
      const { data, status } = await axios({
        method: "get",
        url: `${url}/users`,
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      if (status !== 200) {
        throw new Error("Error fetching contributions");
      }

      dispatch(setAllUsers(data?.data));
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoadingUser(false));
  };

  return {
    loading,
    contributions,
    fetchAllUser,
  };
};
