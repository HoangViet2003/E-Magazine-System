import ChartpinIcon from "../../assets/icons/sidebar-icons/chartPin";
import DriveIcon from "../../assets/icons/sidebar-icons/googleDrive";
import CheckCircleIcon from "../../assets/icons/sidebar-icons/checkCircle";
import TimeIcon from "../../assets/icons/sidebar-icons/time";
import StarIcon from "../../assets/icons/sidebar-icons/star";
import TrashIcon from "../../assets/icons/sidebar-icons/trash";

import MainNav from "./MainNav";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    {
      title: "Dashboard",
      link: "/dashboard",
      icon: (
        <ChartpinIcon
          fill={currentPath === "/dashboard" ? "#004AD7" : "#6B6C7E"}
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
      title: "Selected Contribution",
      link: "/selectedContribution",
      icon: (
        <CheckCircleIcon
          fill={currentPath === "/selectedContribution" ? "#004AD7" : "#6B6C7E"}
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

  return (
    <>
      <ul className="flex flex-col py-6 pe-6">
        {navLinks.map((navLink, index) => (
          <MainNav
            key={index} // Add a unique key prop for each iteration
            isActive={currentPath === navLink.link}
            title={navLink.title}
            to={navLink.link}
          >
            {navLink.icon}
          </MainNav>
        ))}
      </ul>
    </>
  );
}
