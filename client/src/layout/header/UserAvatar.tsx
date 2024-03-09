import { Link } from "react-router-dom";

import GridIcon from "../../assets/icons/grid.svg";
import User from "../../assets/default-user.jpg";

export default function UserAvatar() {
  return (
    <div className="flex items-center gap-4">
      <button className="p-3">
        <img src={GridIcon} alt="grid" />
      </button>
      <Link to={"/"}>
        <img src={User} alt="user" className="h-8 w-8" />
      </Link>
    </div>
  );
}
