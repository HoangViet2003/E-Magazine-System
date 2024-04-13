import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  _id: string;
  title: string;
  message: string;
  actionUrl: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  notifications: Notification[];
  notification: Notification;
  isLoading: boolean;
  currentPage: number;
  totalPage: number;
  totalNotification: number;
  totalUnSeenNotification: number;
}

const initialState: NotificationState = {
  notifications: [],
  notification: {
    _id: "",
    title: "",
    message: "",
    actionUrl: "",
    isRead: false,
    createdAt: "",
    updatedAt: "",
  },
  isLoading: false,
  currentPage: 1,
  totalPage: 0,
  totalNotification: 0,
  totalUnSeenNotification: 0,
};

const slice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAllNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    setNotificationLength(state, action: PayloadAction<number>) {
      state.totalNotification = action.payload;
    },
    setToTalPage(state, action: PayloadAction<number>) {
      state.totalPage = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setIsReadAllNotification(state, action: PayloadAction<number>) {
      state.totalUnSeenNotification = action.payload;
    },
  },
});

const { reducer, actions } = slice;

export const {
  setAllNotifications,
  setLoading,
  setCurrentPage,
  setNotificationLength,
  setToTalPage,
  setIsReadAllNotification,
} = actions;

export type { Notification, NotificationState };

export default reducer;