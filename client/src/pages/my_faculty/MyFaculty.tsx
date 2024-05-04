import MainHeader from "../../ui/MainHeader";
import MyFacultyTable from "./MyFacultyTable";
import ContributionFolder from "./ContributionFolder";

export default function MyFaculty() {
  const role = localStorage.getItem("role");

  return (
    <div>
      {/* <MainHeader>
        <Dropdowns>
          <Dropdowns.Dropdown>
            <Dropdowns.Toggle id="faculty">
              <span className="flex items-center gap-3 rounded-3xl py-1 hover:bg-slate-100 xl:px-6">
                <h1 className="text-xl font-normal">My Faculty</h1>
                <img src={DropdownIcon} alt="" />
              </span>
            </Dropdowns.Toggle>

            <Dropdowns.List id="faculty">
              <Dropdowns.Button icon={DropdownIcon}>Download</Dropdowns.Button>
              <Dropdowns.Button icon={DropdownIcon}>Delete</Dropdowns.Button>
            </Dropdowns.List>
          </Dropdowns.Dropdown>
        </Dropdowns>
      </MainHeader> */}
      <MainHeader>
        <span className="flex items-center gap-3 rounded-3xl py-1 ">
          <h1 className="text-xl font-normal">Your Submission</h1>
        </span>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <ContributionFolder />

        {(role === "marketing coordinator" || role === "student") && (
          <div className="my-5 flex flex-col gap-5 xl:ps-6">
            <MyFacultyTable />
          </div>
        )}
      </div>
    </div>
  );
}
