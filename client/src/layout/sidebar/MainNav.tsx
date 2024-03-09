import { NavLink, useLocation } from "react-router-dom";

export default function MainNav({ icon, activeIcon, title, to }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const activeTab = "bg-activeTabBg text-activeTabContent font-bold";

  return (
    <NavLink to={to}>
      <li
        className={`round flex items-center gap-8 px-6 py-2 ${currentPath === to ? activeTab : ""}`}
        style={{ color: currentPath === to ? "#004AD7" : "#6B6C7E" }}
      >
        <span>
          {currentPath === to ? <img src={activeIcon} /> : <img src={icon} />}
        </span>
        {title}
      </li>
    </NavLink>
  );
}
