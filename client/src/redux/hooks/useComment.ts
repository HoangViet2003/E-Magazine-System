import axios from "../../utils/axios.js";
import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllComments,
  setLoadingComment,
  setComment,
  addNewComment,
} from "../slices/CommentSlice";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useComment = () => {
  const dispatch = useDispatch();

  const { isLoading, comments, comment, totalLength } = useSelector(
    (state: RootState) => state.comment,
  );

  const fetchAllComment = async (submissionId?: string, page?: number) => {
    dispatch(setLoadingComment(true));

    try {
      if (!submissionId) throw new Error("Error fetching comments");

      const { data, status } = await axios.get(
        GET_API(submissionId, page).GET_COMMENTS_BY_SUBMISSION_ID,
      );

      if (status !== 200) {
        throw new Error("Error fetching comments");
      }

      dispatch(setAllComments(data));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingComment(false));
    }
  };
  return {
    totalLength,
    isLoading,
    comments,
    fetchAllComment,
  };
};
