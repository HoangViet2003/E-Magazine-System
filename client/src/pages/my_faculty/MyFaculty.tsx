import MainHeader from "../../ui/MainHeader";

import DropdownIcon from "../../assets/icons/caret-bottom.svg";
import MyFacultyTable from "./MyFacultyTable";
import MyFacultyFolder from "./MyFacultyFolder";
import Dropdowns from "../../ui/Dropdowns";

export default function MyFaculty() {
  return (
    <div>
      <MainHeader>
        <Dropdowns>
          <Dropdowns.Dropdown>
            <Dropdowns.Toggle id="faculty">
              <span className="ms-6 flex items-center gap-3 rounded-3xl px-4 py-1 hover:bg-slate-100">
                <h1 className="text-xl font-normal">My Faculty</h1>
                <img src={DropdownIcon} alt="" />
              </span>
            </Dropdowns.Toggle>

            <Dropdowns.List id="faculty">
              <Dropdowns.Button>Download</Dropdowns.Button>
              <Dropdowns.Button>Delete</Dropdowns.Button>
            </Dropdowns.List>
          </Dropdowns.Dropdown>
        </Dropdowns>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 ps-6">
        <MyFacultyFolder />

        <MyFacultyTable />
      </div>
    </div>
  );
}
