import { Link } from "react-router-dom";

import GridIcon from "../../assets/icons/grid.svg";
import User from "../../assets/default-user.jpg";

export default function UserAvatar() {
  return (
    <div className="flex items-center gap-4">
      <button className="rounded-full p-3 duration-300 hover:bg-slate-200">
        <img src={GridIcon} alt="grid" />
      </button>
      <Link to={"/"}>
        <img
          src={User}
          alt="user"
          className="h-8 w-8 rounded-full object-cover"
        />
      </Link>
    </div>
  );
}
