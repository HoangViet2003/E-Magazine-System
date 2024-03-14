import { Link } from "react-router-dom";

import SearchContribution from "./SearchContribution";

import Logo from "../../assets/Logo.png";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

const Header = () => {
  return (
    <div className="border-b border-borderColor">
      <header className="container flex items-center justify-between gap-8">
        <Link to="/" className="">
          <div className="my-4 flex w-[288px] items-center gap-3">
            <img src={Logo} alt="Logo" className="inline" />
            <h5 className="text-nowrap text-lg font-semibold text-logoText">
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
