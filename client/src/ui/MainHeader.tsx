import { ReactNode } from "react";

import UlListIcon from "../assets/icons/list-ul.svg";
import InfoLineIcon from "../assets/icons/Icon-info-circle-line.svg";

const MainHeader: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center justify-between border-b border-borderColor">
      {children}

      <div className="my-4">
        <button className="p-3">
          <img src={UlListIcon} />
        </button>

        <button className="p-3">
          <img src={InfoLineIcon} />
        </button>
      </div>
    </div>
  );
};

export default MainHeader;
