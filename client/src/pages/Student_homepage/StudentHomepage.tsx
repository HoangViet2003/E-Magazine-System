import MainHeader from "../../ui/MainHeader";

import ContributionFolder from "../my_faculty/ContributionFolder";
import MyFacultyTable from "../my_faculty/MyFacultyTable";

export default function StudentHomepage() {
  return (
    <div>
      <MainHeader>
        <span className="flex items-center gap-3 rounded-3xl py-1 ">
          <h1 className="text-xl font-normal">Your Submission</h1>
          {/* <img src={DropdownIcon} alt="" /> */}
        </span>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <ContributionFolder />

        <MyFacultyTable />
      </div>
    </div>
  );
}
