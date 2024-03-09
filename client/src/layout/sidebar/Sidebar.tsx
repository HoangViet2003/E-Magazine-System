import ChartpinIcon from "../../assets/icons/sidebar-icons/chart_pin.svg";
import DriveIcon from "../../assets/icons/sidebar-icons/google-drive.svg";
import CheckCircleIcon from "../../assets/icons/sidebar-icons/check-circle.svg";
import TimeIcon from "../../assets/icons/sidebar-icons/time.svg";
import StarIcon from "../../assets/icons/sidebar-icons/star-o.svg";
import TrashIcon from "../../assets/icons/sidebar-icons/trash.svg";

import ChartpinIconActive from "../../assets/icons/sidebar-icons/chart_pin-active.svg";
import DriveIconActive from "../../assets/icons/sidebar-icons/google-drive-active.svg";
import CheckCircleIconActive from "../../assets/icons/sidebar-icons/check-circle-active.svg";
import TimeIconActive from "../../assets/icons/sidebar-icons/time-active.svg";
import StarIconActive from "../../assets/icons/sidebar-icons/star-o-active.svg";
import TrashIconActive from "../../assets/icons/sidebar-icons/trash-active.svg";

import MainNav from "./MainNav";

export default function Sidebar() {
  return (
    <>
      <ul className="flex flex-col py-6 pe-6">
        <MainNav
          icon={ChartpinIcon}
          activeIcon={ChartpinIconActive}
          title="Dashboard"
          to="/dashboard"
        />
        <MainNav
          icon={DriveIcon}
          activeIcon={DriveIconActive}
          title="My Faculty"
          to="/myFaculty"
        />
        <MainNav
          icon={CheckCircleIcon}
          activeIcon={CheckCircleIconActive}
          title="Selected Contribution"
          to="/selectedContribution"
        />
        <MainNav
          icon={TimeIcon}
          activeIcon={TimeIconActive}
          title="Recent"
          to="/recent"
        />
        <MainNav
          icon={StarIcon}
          activeIcon={StarIconActive}
          title="Starred"
          to="/starred"
        />
        <MainNav
          icon={TrashIcon}
          activeIcon={TrashIconActive}
          title="Trash"
          to="/trash"
        />
      </ul>
    </>
  );
}
