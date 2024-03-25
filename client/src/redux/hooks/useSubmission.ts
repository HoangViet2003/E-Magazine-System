import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";

const url = "https://e-magazine.onrender.com/api/v1/";
const token = localStorage.getItem("token");

export const useSubmission = () => {
  const dispatch = useDispatch();
  const { isLoading, submissions } = useSelector(
    (state: RootState) => state.submission,
  );

  return {
    isLoading,
    submissions,
  };
};
