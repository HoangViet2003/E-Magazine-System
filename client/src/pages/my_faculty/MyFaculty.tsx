import MainHeader from "../../ui/MainHeader";

import DropdownIcon from "../../assets/icons/caret-bottom.svg";
import MyFacultyTable from "./MyFacultyTable";
import MyFacultyFolder from "./MyFacultyFolder";

export default function MyFaculty() {
  return (
    <div>
      <MainHeader>
        <span className="flex items-center gap-3">
          <h1 className="ps-6 text-xl font-normal">My Faculty</h1>
          <img src={DropdownIcon} alt="" />
        </span>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 ps-6">
        <MyFacultyFolder />

        <MyFacultyTable />
      </div>
    </div>
  );
}
