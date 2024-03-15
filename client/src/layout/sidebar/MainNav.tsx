import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface MainNavProps {
  isActive: boolean;
  title: string;
  to: string;
  children?: ReactNode;
}

const MainNav: React.FC<MainNavProps> = ({ isActive, title, to, children }) => {
  const activeTab = "bg-activeTabBg text-activeTabContent font-bold";

  return (
    <NavLink to={to}>
      <li
        className={`round flex items-center gap-8 px-6 py-2 ${isActive ? activeTab : ""}`}
        style={{ color: isActive ? "#004AD7" : "#6B6C7E" }}
      >
        {children}
        {title}
      </li>
    </NavLink>
  );
};

export default MainNav;
