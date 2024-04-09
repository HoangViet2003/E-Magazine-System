import { useEffect } from "react";
import profile from "../../assets/profile1.png";
import { useNotifications } from "../../redux/hooks/useNotification";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { useContribution } from "../../redux/hooks";
import { useCommentContext } from "../../ui/CommentContext";
import { Notification as NotificationType } from "../../redux/slices/NotiSlice";

const Notification = ({
  setOpenNotification,
}: {
  setOpenNotification: (isOpen: boolean) => void;
}) => {
  // const notifications = [
  //     {
  //         sender: 'Jese Leos',
  //         message: "Hey, what's up? All set for the presentation?",
  //         time: 'a few moments ago',
  //         avatar: 'https://example.com/avatar1.jpg',
  //     },
  //     {
  //         sender: 'Joseph Mcfall',
  //         message: '5 others started following you.',
  //         time: '10 minutes ago',
  //         avatar: 'https://example.com/avatar2.jpg',
  //     },
  //     {
  //         sender: 'Bonnie Green',
  //         message: '141 others love your story. See it and view more stories.',
  //         time: '44 minutes ago',
  //         avatar: 'https://example.com/avatar3.jpg',
  //     },
  //     {
  //         sender: 'Leslie Livingston',
  //         message: '@bonnie.green what do you say?',
  //         time: '44 minutes ago',
  //         avatar: 'https://example.com/avatar4.jpg',
  //     },
  //     {
  //         sender: 'Robert Brown',
  //         message: 'Glassmorphism - learn how to implement the new design trend.',
  //         time: '3 hours ago',
  //         avatar: 'https://example.com/avatar5.jpg',
  //     },
  //     {
  //         sender: 'Robert Brown',
  //         message: 'Glassmorphism - learn how to implement the new design trend.',
  //         time: '3 hours ago',
  //         avatar: 'https://example.com/avatar5.jpg',
  //     },
  //     {
  //         sender: 'Robert Brown',
  //         message: 'Glassmorphism - learn how to implement the new design trend.',
  //         time: '3 hours ago',
  //         avatar: 'https://example.com/avatar5.jpg',
  //     },
  //     {
  //         sender: 'Robert Brown',
  //         message: 'Glassmorphism - learn how to implement the new design trend.',
  //         time: '3 hours ago',
  //         avatar: 'https://example.com/avatar5.jpg',
  //     },
  //     {
  //         sender: 'Robert Brown',
  //         message: 'Glassmorphism - learn how to implement the new design trend.',
  //         time: '3 hours ago',
  //         avatar: 'https://example.com/avatar5.jpg',
  //     },
  //     {
  //         sender: 'Robert Brown',
  //         message: 'Glassmorphism - learn how to implement the new design trend.',
  //         time: '3 hours ago',
  //         avatar: 'https://example.com/avatar5.jpg',
  //     },
  // ];

  const {
    getAllNotifications,
    notifications,
    totalPage,
    totalNotification,
    currentPage,
    handleSetCurrentPage,
  } = useNotifications();

  const { contributions, fetchAllContribution } = useContribution();
  const { setOpenComment } = useCommentContext();

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  function handleNavigateNotification(notification: NotificationType) {
    const currContribution = contributions.filter(
      (contribution) =>
        contribution.academicYear !==
        new Date(notification.createdAt).getFullYear(),
    );

    if (role === "marketing coordinator") {
      navigate(
        `/myFaculty/contributions${notification.actionUrl}?contributionId=${currContribution[0]._id}`,
      );
    } else if (role === "student" && currContribution.length > 0) {
      navigate(
        `/student${notification.actionUrl}?contributionId=${currContribution[0]._id}`,
      );
    }
    setOpenNotification(false);

    if (
      notification.title.includes("Comment") ||
      notification.title.includes("Reply")
    )
      setOpenComment(true);
  }

  useEffect(() => {
    fetchAllContribution();
    getAllNotifications(currentPage);
  }, []);

  function calculateDate(date?: string) {
    const createdDate = new Date(date || new Date().toISOString());
    const today = new Date();

    // Calculate the difference in milliseconds between the given date and today
    const differenceInMilliseconds = today.getTime() - createdDate.getTime();
    const differenceHours = Math.round(
      differenceInMilliseconds / (1000 * 3600),
    );

    if (differenceHours > 24) {
      const differenceInDays = Math.round(differenceHours / 24);
      return differenceInDays + " days ago";
    }

    return differenceHours + " hours ago";
  }

  return (
    <div className="z-[20] w-[420px] rounded-lg bg-white py-4 shadow-md">
      <div className="mb-4 flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button className="text-blue-500 hover:text-blue-700">View all</button>
      </div>
      <div className="space-y-4">
        <InfiniteScroll
          style={{ height: "400px" }}
          dataLength={notifications?.length}
          next={() => {
            getAllNotifications(currentPage + 1);
            handleSetCurrentPage(currentPage + 1);
          }}
          hasMore={currentPage !== totalPage}
          loader={
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>You have seen it all</b>
            </p>
          }
        >
          {notifications?.map((notification, index) => (
            <div
              key={index}
              className="relative mx-1 flex cursor-pointer items-center gap-3 rounded px-3 py-2 hover:bg-slate-200"
              onClick={() => handleNavigateNotification(notification)}
            >
              <img
                src={profile}
                alt="avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col gap-1">
                <h6 className="text-sm font-semibold">{notification?.title}</h6>
                <p className="text-sm text-gray-600">{notification?.message}</p>
                <p className="text-xs text-gray-500">
                  {calculateDate(notification?.createdAt)}
                </p>
              </div>

              {!notification.isRead && (
                <span className="absolute right-4 h-2 w-2 rounded-full bg-[#004AD7]"></span>
              )}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Notification;
