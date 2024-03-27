import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSidebarContext } from "./SidebarContext";
import { useState } from "react";
import useWindowWidth from "../../redux/hooks/useWindowWidth";

import MainNav from "./MainNav";
import ChartpinIcon from "../../assets/icons/sidebar-icons/chartPin";
import DriveIcon from "../../assets/icons/sidebar-icons/googleDrive";
import CheckCircleIcon from "../../assets/icons/sidebar-icons/checkCircle";
import TimeIcon from "../../assets/icons/sidebar-icons/time";
import StarIcon from "../../assets/icons/sidebar-icons/star";
import TrashIcon from "../../assets/icons/sidebar-icons/trash";
import PlusIcon from "../../assets/icons/sidebar-icons/plusIcon";
import FileUploadIcon from "../../assets/icons/sidebar-icons/uploadLight";
import NewDocumentIcon from "../../assets/icons/sidebar-icons/fileDocLight";
import ImageIcon from "../../assets/icons/sidebar-icons/imgDuoTone";
import Logo from "../../assets/Logo.png";
import Dropdowns from "../../ui/Dropdowns";

export default function Sidebar() {
  const currentPath = useLocation().pathname;
  const windowWidth = useWindowWidth();
  const { openSidebar, setOpenSidebar } = useSidebarContext();
  const [isHovered, setIsHovered] = useState(false);

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

  return windowWidth < 1024 ? (
    createPortal(
      <>
        <div
          className={`fixed top-0 z-20 h-full w-80  items-center justify-between gap-2 bg-white py-6 shadow-lg duration-300 ease-in-out xl:static xl:gap-8 ${!openSidebar ? " -translate-x-full transform" : ""}`}
        >
          <Link to="/" className="">
            <div className="flex items-center gap-3 border-b border-b-borderColor px-6 pb-6">
              <img src={Logo} alt="Logo" className="inline" />
              <h5 className="text-nowrap text-lg font-semibold text-logoText">
                E-Magazine System
              </h5>
            </div>
          </Link>

          <ul className="flex flex-col py-6 xl:pe-6">
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

        {openSidebar && (
          <div
            className="fixed top-0 z-10 h-full w-full bg-black opacity-70"
            onClick={() => setOpenSidebar(false)}
          ></div>
        )}
      </>,
      document.body,
    )
  ) : (
    <div>
      {/* <Dropdowns>
        <Dropdowns.Dropdown>
          <Dropdowns.Toggle id="newDocument">
            <div
              className="flex gap-4 rounded-lg border border-borderColor px-4 py-3 shadow-lg hover:bg-activeTabBg hover:text-[#004AD7]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <PlusIcon fill={isHovered ? "#004AD7" : "#6B6C7E"} />
              <span>New</span>
            </div>
          </Dropdowns.Toggle>

          <Dropdowns.List id="newDocument">
            <Dropdowns.Button icon={<FileUploadIcon />}>
              <span className="font-normal text-[#6B6C7E] hover:text-[#004AD7]">
                Files upload
              </span>
            </Dropdowns.Button>
            <Dropdowns.Button icon={<NewDocumentIcon />}>
              <span className="font-normal text-[#6B6C7E] hover:text-[#004AD7]">
                New Document
              </span>
            </Dropdowns.Button>
            <Dropdowns.Button icon={<ImageIcon />}>
              <span className="font-normal text-[#6B6C7E] hover:text-[#004AD7]">
                New Gallery
              </span>
            </Dropdowns.Button>
          </Dropdowns.List>
        </Dropdowns.Dropdown>
      </Dropdowns> */}

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
