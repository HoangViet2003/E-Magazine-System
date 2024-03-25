import { Link } from "react-router-dom";

import SearchArticle from "./SearchArticle";

import Logo from "../../assets/Logo.png";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

const Header = () => {
  return (
    <div className="my-4 border-b border-borderColor">
      <header className="container my-4 flex items-center justify-between gap-5 xl:gap-8">
        <Link to="/" className="hidden xl:inline-block">
          <div className=" flex w-[288px] items-center gap-3">
            <img src={Logo} alt="Logo" className="inline" />
            <h5 className="text-nowrap text-lg font-semibold text-logoText">
              E-Magazine System
            </h5>
          </div>
        </Link>

        <SearchArticle />
        <HeaderMenu />
        <UserAvatar />
      </header>
    </div>
  );
};

export default Header;
