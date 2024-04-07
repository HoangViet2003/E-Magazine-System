import { useAuth } from "../../redux/hooks/useAuth";
import { useState } from "react";
import Dropdowns from "../../ui/Dropdowns";
import NotificationIcon from "../../assets/icons/Bell_pin_fill.svg";
import User from "../../assets/default-user.jpg";
import UserIcon from "../../assets/icons/User_fill.svg";
import SignoutIcon from "../../assets/icons/Sign_out_circle_duotone_line.svg";
import Notification from './../../components/notification/Notification';

export default function UserAvatar() {
  const { logout } = useAuth();
  const [openNotification, setOpenNotification] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* <Dropdowns>
        <Dropdowns.Dropdown> */}
      {/* <Dropdowns.Toggle id="notification" startPosition="right"> */}
      <div className="hidden rounded-full p-1 duration-300 hover:bg-slate-200 xl:block" onClick={() => setOpenNotification(!openNotification)}>
        <img src={NotificationIcon} />
      </div>
      {/* </Dropdowns.Toggle> */}

      {/* <Dropdowns.List id="notification" startPosition="right" > */}
      {/* <Dropdowns.Button icon={UserIcon}>
              <span className="font-bold" style={{ color: "#004AD7" }}>
                Profile
              </span>
            </Dropdowns.Button>
            <Dropdowns.Button icon={SignoutIcon} onClick={logout}>
              <span className="font-bold" style={{ color: "#CA3636" }}>
                Sign out
              </span>
            </Dropdowns.Button> */}
    {openNotification && <div className="absolute w-100 right-20 top-20 z-[999999]"><Notification/></div>}

      {/* </Dropdowns.List> */}
      {/* </Dropdowns.Dropdown>
      </Dropdowns> */}

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
