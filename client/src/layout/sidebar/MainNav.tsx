import { NavLink } from "react-router-dom";

export default function MainNav({ icon, isActive, title, to, children }) {
  const activeTab = "bg-activeTabBg text-activeTabContent font-bold";

  return (
    <NavLink to={to}>
      <li
        className={`round flex items-center gap-8 px-6 py-2 ${isActive ? activeTab : ""}`}
        style={{ color: isActive ? "#004AD7" : "#6B6C7E" }}
      >
        {children}
        {/* <span>
          {currentPath === to ? 
          <img src={activeIcon} /> 
          : <img src={icon} />}
        </span> */}
        {title}
      </li>
    </NavLink>
  );
}
