import ChartpinIcon from "../../assets/icons/sidebar-icons/chartPin";
import DriveIcon from "../../assets/icons/sidebar-icons/googleDrive";
import CheckCircleIcon from "../../assets/icons/sidebar-icons/checkCircle";
import TimeIcon from "../../assets/icons/sidebar-icons/time";
import StarIcon from "../../assets/icons/sidebar-icons/star";
import TrashIcon from "../../assets/icons/sidebar-icons/trash";
import Logo from "../../assets/Logo.png";

import MainNav from "./MainNav";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    {
      title: "Dashboard",
      link: "/dashboard",
      icon: (
        <ChartpinIcon
          fill={
            currentPath === "/dashboard" || currentPath === "/"
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

  {
    true && (
      <div className="fixed top-0 z-10 my-4 w-11/12 items-center justify-between gap-2 bg-red-500 md:static md:gap-8">
        <Link to="/" className="md:hidden">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="inline" />
            <h5 className="text-nowrap text-lg font-semibold text-logoText">
              E-Magazine System
            </h5>
          </div>
        </Link>

        <ul className="flex flex-col py-6 pe-6">
          {navLinks.map((navLink, index) => (
            <MainNav
              key={index}
              isActive={currentPath === navLink.link}
              title={navLink.title}
              to={navLink.link}
            >
              {navLink.icon}
            </MainNav>
          ))}
        </ul>
      </div>
    );
  }
}
