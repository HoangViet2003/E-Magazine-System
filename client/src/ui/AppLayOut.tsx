import Header from "../layout/header/Header";
import Sidebar from "../layout/sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "../layout/sidebar/SidebarContext";
import { useAuth } from "../redux/hooks/useAuth";
import SidebarStudent from "../layout/sidebar/SidebarStudent";

import ChartpinIcon from "../assets/icons/sidebar-icons/chartPin";
import DriveIcon from "../assets/icons/sidebar-icons/googleDrive";
import CheckCircleIcon from "../assets/icons/sidebar-icons/checkCircle";
import TimeIcon from "../assets/icons/sidebar-icons/time";
import StarIcon from "../assets/icons/sidebar-icons/star";
import TrashIcon from "../assets/icons/sidebar-icons/trash";
import { CommentProvider } from "./CommentContext";
import SidebarAdmin from "../layout/sidebar/SidebarAdmin";

export default function AppLayOut() {
  const currentPath = useLocation().pathname;
  const { user } = useAuth();
  const marketingCoorNavLinks = [
    {
      title: "Dashboard",
      link: "/dashboard",
      icon: (
        <ChartpinIcon
          fill={
            currentPath.includes("/dashboard") || currentPath === "/"
              ? "#004AD7"
              : "#6B6C7E"
          }
        />
      ),
    },
    {
      title: "My Faculty",
      link: "/myFaculty",
      icon: (
        <DriveIcon
          fill={currentPath === "/myFaculty" ? "#004AD7" : "#6B6C7E"}
        />
      ),
    },
    {
      title: "Selected Article",
      link: "/selectedArticle",
      icon: (
        <CheckCircleIcon
          fill={currentPath === "/selectedArticle" ? "#004AD7" : "#6B6C7E"}
        />
      ),
    },
    {
      title: "Recent",
      link: "/recent",
      icon: (
        <TimeIcon fill={currentPath === "/recent" ? "#004AD7" : "#6B6C7E"} />
      ),
    },
    {
      title: "Starred",
      link: "/starred",
      icon: (
        <StarIcon fill={currentPath === "/starred" ? "#004AD7" : "#6B6C7E"} />
      ),
    },
    {
      title: "Trash",
      link: "/trash",
      icon: (
        <TrashIcon fill={currentPath === "/trash" ? "#004AD7" : "#6B6C7E"} />
      ),
    },
  ];

  const marketingManagerNavLinks = [
    {
      title: "Dashboard",
      link: "/dashboard",
      icon: (
        <ChartpinIcon
          fill={
            currentPath.includes("/dashboard") || currentPath === "/"
              ? "#004AD7"
              : "#6B6C7E"
          }
        />
      ),
    },
    {
      title: "My Faculty",
      link: "/myFaculty",
      icon: (
        <DriveIcon
          fill={currentPath === "/myFaculty" ? "#004AD7" : "#6B6C7E"}
        />
      ),
    },
    {
      title: "Selected Article",
      link: "/selectedArticle",
      icon: (
        <CheckCircleIcon
          fill={currentPath === "/selectedArticle" ? "#004AD7" : "#6B6C7E"}
        />
      ),
    },
    {
      title: "Recent",
      link: "/recent",
      icon: (
        <TimeIcon fill={currentPath === "/recent" ? "#004AD7" : "#6B6C7E"} />
      ),
    },
    {
      title: "Starred",
      link: "/starred",
      icon: (
        <StarIcon fill={currentPath === "/starred" ? "#004AD7" : "#6B6C7E"} />
      ),
    },
    {
      title: "Trash",
      link: "/trash",
      icon: (
        <TrashIcon fill={currentPath === "/trash" ? "#004AD7" : "#6B6C7E"} />
      ),
    },
  ];

  const adminNavLinks = [
    {
      title: "Dashboard",
      link: "/dashboard",
      icon: (
        <ChartpinIcon
          fill={
            currentPath.includes("/dashboard") || currentPath === "/"
              ? "#004AD7"
              : "#6B6C7E"
          }
        />
      ),
    },
    {
      title: "Faculty",
      link: "/faculty",
      icon: (
        <DriveIcon
          fill={currentPath === "/myFaculty" ? "#004AD7" : "#6B6C7E"}
        />
      ),
    },
    {
      title: "Account",
      link: "/account",
      icon: (
        <DriveIcon
          fill={currentPath === "/myFaculty" ? "#004AD7" : "#6B6C7E"}
        />
      ),
    },
  ];

  const guestNavLinks = [
    {
      title: "Faculty",
      link: "/myFaculty",
      icon: (
        <ChartpinIcon
          fill={currentPath.includes("/myFaculty") ? "#004AD7" : "#6B6C7E"}
        />
      ),
    },
  ];

  return (
    <SidebarProvider>
      <CommentProvider>
        <div className="grid min-h-screen grid-rows-[auto_1fr] border-borderColor font-BeVietnamPro">
          <Header />
          <div className="container relative grid grid-cols-[1fr] xl:grid-cols-[300px_1fr]">
            {user.role === "student" && <SidebarStudent />}
            {user.role === "marketing coordinator" && (
              <Sidebar navLinks={marketingCoorNavLinks} />
            )}
            {user.role === "marketing manager" && (
              <Sidebar navLinks={marketingManagerNavLinks} />
            )}
            {user.role === "administrator" && (
              <SidebarAdmin navLinks={adminNavLinks} />
            )}
            {user.role === "guest" && <Sidebar navLinks={guestNavLinks} />}

            <Outlet />
          </div>
        </div>
      </CommentProvider>
    </SidebarProvider>
  );
}
