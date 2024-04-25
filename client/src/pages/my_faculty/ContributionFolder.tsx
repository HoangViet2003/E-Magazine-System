import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useContribution } from "../../redux/hooks/useContribution";

import FolderIcon from "../../assets/icons/folder.svg";
import { useSubmission } from "../../redux/hooks/useSubmission";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function ContributionFolder() {
  const navigate = useNavigate();
  const {
    contributions,
    isLoading: loadingContribution,
    fetchAllContribution,
    fetchAllContributionByManager,
  } = useContribution();
  const { getSubmissionByStudentToNavigate } = useSubmission();
  const role = localStorage.getItem("role");

  function calculateClosureDate(date?: string) {
    const closureDate = new Date(date || new Date().toISOString());
    const today = new Date();

    // Calculate the difference in milliseconds between the given date and today
    const differenceInMilliseconds = closureDate.getTime() - today.getTime();
    const differenceInDays = Math.round(
      differenceInMilliseconds / (1000 * 3600 * 24),
    );

    return differenceInDays;
  }

  useEffect(() => {
    if (role === "marketing manager") {
      fetchAllContributionByManager(1);
    } else {
      fetchAllContribution();
    }
  }, []);

  function handleSubmissionNavigate(contributionId: string) {
    navigate(`contributions/${contributionId}`);
  }

  function handleStudentSubmission(contributionId: string) {
    getSubmissionByStudentToNavigate(contributionId);
  }

  function handleManagerNavigate(contributionId: string) {
    navigate(`contributions/academic-year?academicYear=${contributionId}`);
  }

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Contributions
      </h3>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {contributions.map((contribution, index) => (
          <button
            key={index}
            className="rounded border border-borderColor p-4 hover:bg-slate-100"
            onDoubleClick={async () => {
              if (role === "student") {
                handleStudentSubmission(contribution._id);
              } else if (role === "marketing coordinator") {
                handleSubmissionNavigate(contribution._id);
              } else if (role === "marketing manager") {
                handleManagerNavigate(contribution._id);
              } else if (role === "guest") {
                handleSubmissionNavigate(contribution._id);
              }
            }}
          >
            <div className={"flex items-center gap-4"}>
              <img src={FolderIcon} />

              <span className={ellipsis + " font-semibold leading-tight"}>
                {contribution.academicYear + " Contributions"}

                {contribution.status === "open" &&
                  new Date(
                    contribution?.closureDate || new Date().toISOString(),
                  ).getTime() - new Date().getTime() && (
                    <div
                      className={
                        ellipsis + " text-left text-[10px] font-normal"
                      }
                      style={{ color: "#CA3636" }}
                    >
                      {calculateClosureDate(contribution.closureDate) < 0
                        ? ""
                        : `${calculateClosureDate(contribution.closureDate)} days until closure date`}
                    </div>
                  )}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
