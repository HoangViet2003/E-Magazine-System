import { useNavigate, useParams } from "react-router-dom";
import { useContribution } from "../../../redux/hooks/useContribution";
import { useEffect } from "react";

import MainHeader from "../../../ui/MainHeader";
import Dropdowns from "../../../ui/Dropdowns";

import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import ContributionTable from "./ContributionTable";
// import { useSubmission } from "../../../redux/hooks/useSubmission";

export default function MyFaculty() {
  const navigate = useNavigate();
  const {
    isLoading,
    contribution,
    contributions,
    setContributionById,
    fetchAllContribution,
  } = useContribution();
  const role = localStorage.getItem("role");
  const { contributionId } = useParams();

  useEffect(() => {
    fetchAllContribution();
  }, []);

  useEffect(() => {
    if (contributionId) {
      setContributionById(contributionId);
    }
  }, [contributionId, contributions]);

  return (
    <div>
      {!isLoading && (
        <MainHeader>
          <div className="flex items-center">
            <h1
              className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
              onClick={() =>
                role === "student"
                  ? navigate("/student")
                  : navigate("/myFaculty")
              }
            >
              {role === "student" ? "Your Submission" : "My Faculty"}
            </h1>
            <img src={BreadcrumbPointer} />

            {contribution && (
              <Dropdowns>
                <Dropdowns.Dropdown>
                  <Dropdowns.Toggle id={contribution._id}>
                    <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                      <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                        {contribution.academicYear + " Contributions"}
                      </h1>
                      <img src={DropdownIcon} alt="" />
                    </span>
                  </Dropdowns.Toggle>

                  <Dropdowns.List id={contribution._id}>
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

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <ContributionTable />
      </div>
    </div>
  );
}
