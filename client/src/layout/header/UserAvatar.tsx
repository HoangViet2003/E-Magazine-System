import { useAuth } from "../../redux/hooks/useAuth";
import { useEffect, useState } from "react";
import Dropdowns from "../../ui/Dropdowns";
import NotificationIcon from "../../assets/icons/Bell_pin_fill.svg";
import UnSeenNotificationIcon from "../../assets/icons/Bell_unseen.svg";
import User from "../../assets/default-user.jpg";
import UserIcon from "../../assets/icons/User_fill.svg";
import SignoutIcon from "../../assets/icons/Sign_out_circle_duotone_line.svg";
import Notification from "./../../components/notification/Notification";
import { useNotifications } from "../../redux/hooks/useNotification";
import { useOutsideClick } from "../../redux/hooks/useOutsideClick";
import useAddNoScrollClass from "../../redux/hooks/useAddNoScrollClass";

export default function UserAvatar() {
  const { logout } = useAuth();
  const [openNotification, setOpenNotification] = useState(false);
  const {
    totalUnSeenNotification,
    handleReadNotification,
    handleUpdateUnSeenNotification,
    getAllNotifications,
    currentPage,
  } = useNotifications();

  useEffect(() => {
    getAllNotifications(currentPage);
  }, []);

  const ref = useOutsideClick(
    () => setOpenNotification(false),
    false,
  ) as React.RefObject<HTMLDivElement>;

  useAddNoScrollClass(openNotification);

  return (
    <div className="flex items-center gap-4">
      <button
        className="hidden rounded-full p-1 duration-300 hover:bg-slate-200 xl:block"
        onClick={() => {
          setOpenNotification(!openNotification);
          handleReadNotification(0);
          handleUpdateUnSeenNotification();
        }}
      >
        <img
          src={
            totalUnSeenNotification > 0
              ? UnSeenNotificationIcon
              : NotificationIcon
          }
        />
      </button>

      {openNotification && (
        <div className="w-100 absolute right-20 top-20 z-20" ref={ref}>
          <Notification setOpenNotification={setOpenNotification} />
        </div>
      )}

      <Dropdowns>
        <Dropdowns.Dropdown>
          <Dropdowns.Toggle id="faculty" startPosition="right">
            <a>
              <img
                src={User}
                alt="user"
                className="h-8 w-8 rounded-full object-cover"
              />
            </a>
          </Dropdowns.Toggle>

          <Dropdowns.List id="faculty" startPosition="right">
            <Dropdowns.Button icon={UserIcon}>
              <span className="font-bold" style={{ color: "#004AD7" }}>
                Profile
              </span>
            </Dropdowns.Button>
            <Dropdowns.Button icon={SignoutIcon} onClick={logout}>
              <span className="font-bold" style={{ color: "#CA3636" }}>
                Sign out
              </span>
            </Dropdowns.Button>
          </Dropdowns.List>
        </Dropdowns.Dropdown>
      </Dropdowns>
    </div>
  );
}
