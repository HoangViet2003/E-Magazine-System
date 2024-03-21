import { ReactNode } from "react";

import UlListIcon from "../assets/icons/list-ul.svg";
import InfoLineIcon from "../assets/icons/Icon-info-circle-line.svg";

const MainHeader: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center justify-between border-b border-borderColor py-4">
      {children}

      <div className="hidden lg:block">
        <button className="rounded-full p-3 hover:bg-slate-100">
          <img src={UlListIcon} />
        </button>

        <button className="rounded-full p-3 hover:bg-slate-100">
          <img src={InfoLineIcon} />
        </button>
      </div>
    </div>
  );
};

export default MainHeader;
