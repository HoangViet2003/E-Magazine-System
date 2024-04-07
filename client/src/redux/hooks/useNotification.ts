import { RootState } from "../index";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllNotifications,
  setLoading,
  setCurrentPage,
  setNotificationLength,
  setToTalPage,
} from "../slices/NotiSlice";
import axios from "../../utils/axios.js";
import { GET_API, PUT_API, DELETE_API, POST_API } from "../../constants/api.js";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    notifications,
    totalPage,
    totalNotification,
    currentPage,
  } = useSelector((state: RootState) => state.noti);

  const getAllNotifications = async (page: number) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(GET_API("", page).GET_ALL_NOTIFICATIONS);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      if (page === 1) {
        dispatch(setAllNotifications(res.data.notifications));
        dispatch(setNotificationLength(res.data.totalNotification));
        dispatch(setToTalPage(res.data.totalPage));
      } else {
        const newArr = [...notifications, ...res.data.notifications];
        dispatch(setAllNotifications(newArr));
      }


      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  const handleSetCurrentPage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return {
    getAllNotifications,
    isLoading,
    notifications,
    totalPage,
    totalNotification,
    handleSetCurrentPage,
    currentPage,
  };
};
