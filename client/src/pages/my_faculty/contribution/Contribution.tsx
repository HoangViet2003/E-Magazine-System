import { useNavigate, useParams } from "react-router-dom";
import { useContribution } from "../../../redux/hooks/useContribution";
import { useEffect } from "react";

import MainHeader from "../../../ui/MainHeader";
import Dropdowns from "../../../ui/Dropdowns";

import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import ContributionTable from "./ContributionTable";
import { useSubmission } from "../../../redux/hooks/useSubmission";

export default function MyFaculty() {
  const navigate = useNavigate();
  const { contributeId } = useParams();
  const { contributions, fetchAllContribution } = useContribution();

  // const { fetchAllSubmission } = useSubmission();

  const selectedContribution =
    contributions.length > 0
      ? contributions.filter(
          (contribution) => contribution._id === contributeId,
        )[0]
      : undefined;

  useEffect(() => {
    fetchAllContribution();
    // fetchAllSubmission();
  }, []);

  return (
    <div>
      <MainHeader>
        <div className="flex items-center">
          <h1
            className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
            onClick={() => navigate("/myFaculty")}
          >
            My Faculty
          </h1>
          <img src={BreadcrumbPointer} />

          {selectedContribution && (
            <Dropdowns>
              <Dropdowns.Dropdown>
                <Dropdowns.Toggle id={selectedContribution._id}>
                  <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                    <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                      {selectedContribution.academicYear + " Contributions"}
                    </h1>
                    <img src={DropdownIcon} alt="" />
                  </span>
                </Dropdowns.Toggle>

                <Dropdowns.List id={selectedContribution._id}>
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

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <ContributionTable />
      </div>
    </div>
  );
}