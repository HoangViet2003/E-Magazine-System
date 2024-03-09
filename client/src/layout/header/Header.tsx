import { Link } from "react-router-dom";

import SearchContribution from "./SearchContribution";

import Logo from "../../assets/Logo.png";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

const Header = () => {
  return (
    <div className="border-borderColor border-b">
      <header className="container flex items-center justify-between gap-8">
        <Link to="/" className="">
          <div className="my-4 flex items-center gap-3">
            <img src={Logo} alt="Logo" className="inline" />
            <h5 className="text-logoText text-nowrap text-lg font-semibold">
              E-Magazine System
            </h5>
          </div>
        </Link>

        <SearchContribution />
        <HeaderMenu />
        <UserAvatar />
      </header>
      {/* </div> */}
    </div>
  );
};

export default Header;
