import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContribution } from "../../../redux/hooks";
import MainHeader from "../../../ui/MainHeader";
import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import Dropdowns from "../../../ui/Dropdowns";
import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import ManagerTable from "./ManagerTable";
import Spinner from "../../../ui/Spinner";

export default function ManagerFolder() {
  const navigate = useNavigate();
  const {
    isLoading,
    managerContributions,
    fetchAllContributionByAcademicYear,
  } = useContribution();
  // const { contributionId } = useParams();
  const role = localStorage.getItem("role");
  const [searchParams] = useSearchParams();
  const academicYear = searchParams.get("academicYear") || "";

  useEffect(() => {
    if (role === "marketing manager")
      fetchAllContributionByAcademicYear(parseInt(academicYear, 10));
  }, []);

  return (
    <div>
      {!isLoading && (
        <MainHeader>
          <div className="flex items-center">
            <h1
              className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
              onClick={() => navigate("/myFaculty")}
            >
              {role === "student" ? "Your Submission" : "My Faculty"}
            </h1>
            <img src={BreadcrumbPointer} />

            {managerContributions && managerContributions.length > 0 && (
              <Dropdowns>
                <Dropdowns.Dropdown>
                  <Dropdowns.Toggle id={managerContributions[0]._id}>
                    <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                      <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                        {managerContributions[0].academicYear +
                          " Contributions"}
                      </h1>
                      <img src={DropdownIcon} alt="" />
                    </span>
                  </Dropdowns.Toggle>

                  <Dropdowns.List id={managerContributions[0]._id}>
                    <Dropdowns.Button icon={DropdownIcon}>
                      Download
                    </Dropdowns.Button>
                    <Dropdowns.Button icon={DropdownIcon}>
                      Delete
                    </Dropdowns.Button>
                  </Dropdowns.List>
                </Dropdowns.Dropdown>
              </Dropdowns>
            )}
          </div>
        </MainHeader>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="my-5 flex flex-col gap-5 xl:ps-6">
          <ManagerTable />
        </div>
      )}
    </div>
  );
}
