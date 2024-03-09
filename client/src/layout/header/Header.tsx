import { Link } from "react-router-dom";

import SearchContribution from "./SearchContribution";

import Logo from "../../assets/Logo.png";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

const Header = () => {
  return (
    <>
      <header className="container flex items-center justify-between gap-8">
        <Link to="/" className="">
          <div className="my-4 flex items-center gap-3">
            <img src={Logo} alt="Logo" className="inline" />
            <h5 className="text-logoText text-lg font-semibold text-nowrap">
              E-Magazine System
            </h5>
          </div>
        </Link>

        <SearchContribution />
        <HeaderMenu />
        <UserAvatar />
      </header>
      {/* </div> */}
    </>
  );
};

export default Header;
