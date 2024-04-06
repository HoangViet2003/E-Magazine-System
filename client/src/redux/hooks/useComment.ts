import axios from "../../utils/axios.js";
import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllComments,
  setLoadingComment,
  setComment,
  addNewComment,
  getMoreComment,
  Comment,
  addNewReply,
} from "../slices/CommentSlice";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

export const useComment = () => {
  const dispatch = useDispatch();
  const { _id, name } = JSON.parse(localStorage.getItem("user") || "{}");

  const { isLoading, comments, comment, totalLength } = useSelector(
    (state: RootState) => state.comment,
  );

  const fetchAllComment = async (submissionId?: string, page?: number) => {
    dispatch(setLoadingComment(true));

    try {
      if (!submissionId) throw new Error("SubmissionId is required");

      const { data, status } = await axios.get(
        GET_API(submissionId, page).GET_COMMENTS_BY_SUBMISSION_ID,
      );

      if (status !== 200) throw new Error("Error fetching comments");

      dispatch(setAllComments(data));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingComment(false));
    }
  };

  const fetchMoreComment = async (submissionId?: string, page?: number) => {
    dispatch(setLoadingComment(true));

    try {
      if (!submissionId) throw new Error("SubmissionId is required");

      const { data, status } = await axios.get(
        GET_API(submissionId, page).GET_COMMENTS_BY_SUBMISSION_ID,
      );

      if (status !== 200) throw new Error("Error fetching comments");

      data.comments.map((comment: Comment) =>
        dispatch(getMoreComment(comment)),
      );
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingComment(false));
    }
  };

  const sendComment = async (content: string, submissionId?: string) => {
    dispatch(setLoadingComment(true));

    try {
      if (!submissionId) throw new Error("SubmissionId is required");

      // const newComment = {
      //   _id: uuidv4(),
      //   submissionId,
      //   userId: {
      //     _id,
      //     name,
      //   },
      //   content,
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString(),
      // };

      const { data, status } = await axios.post(
        POST_API(submissionId).CREATE_COMMENT,
        {
          content: content,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      dispatch(addNewComment(data?.newComment));

      if (status !== 201) throw new Error("Error sending comments");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingComment(false));
    }
  };

  const replyComment = async (
    content: string,
    submissionId?: string,
    parentCommentId?: string,
  ) => {
    dispatch(setLoadingComment(true));

    try {
      if (!submissionId) throw new Error("SubmissionId is required");

      if (!parentCommentId) throw new Error("parentCommentId is required");

      const newComment = {
        _id: uuidv4(),
        submissionId,
        userId: {
          _id,
          name,
        },
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log(content);
      dispatch(addNewReply({ comment: newComment, parentCommentId }));

      const { data, status } = await axios.post(
        POST_API(parentCommentId).REPLY_COMMENT,
        {
          content: content,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(data);

      if (status !== 201) throw new Error("Error sending comments");
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
    fetchMoreComment,
    sendComment,
    replyComment,
  };
};
