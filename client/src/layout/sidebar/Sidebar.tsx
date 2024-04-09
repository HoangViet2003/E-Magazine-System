import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSidebarContext } from "./SidebarContext";
import useWindowWidth from "../../redux/hooks/useWindowWidth";

import MainNav from "./MainNav";
import Logo from "../../assets/Logo.png";

interface NavLink {
  title: string;
  link: string;
  icon: React.ReactNode; // Assuming the icon is a React component or element
}

export default function Sidebar({ navLinks }: { navLinks: NavLink[] }) {
  const currentPath = useLocation().pathname;
  const windowWidth = useWindowWidth();
  const { openSidebar, setOpenSidebar } = useSidebarContext();

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
