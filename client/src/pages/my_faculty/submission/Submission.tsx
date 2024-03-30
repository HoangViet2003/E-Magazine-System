import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useSubmission } from "../../../redux/hooks/useSubmission";

import MainHeader from "../../../ui/MainHeader";
import Dropdowns from "../../../ui/Dropdowns";
import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import SubmissionTable from "./SubmissionTable";
import { useContribution } from "../../../redux/hooks";
import SubmissionEmpty from "./SubmissionEmpty";
import Spinner from "../../../ui/Spinner";
import { format } from "date-fns";

export default function Submission() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const {
    contribution,
    contributions,
    getContributionById,
    fetchAllContribution,
  } = useContribution();
  const {
    submission,
    submissions,
    isLoading: loadingSubmission,
    getSubmissionByStudent,
    fetchAllSubmission,
    getSubmissionById,
  } = useSubmission();
  const [searchParams] = useSearchParams();
  const contributionId = searchParams.get("contributionId") || "";
  const today = new Date();

  const isUnsubmittable =
    contribution.closureDate &&
    today.getTime() < new Date(contribution.closureDate).getTime()
      ? true
      : false;

  const isEditable =
    contribution.finalClosureDate &&
    today.getTime() < new Date(contribution.finalClosureDate).getTime()
      ? true
      : false;

  // Get contribution and set in state
  useEffect(() => {
    const fetchContributions = async () => {
      await fetchAllContribution();
    };
    fetchContributions();
  }, [contributionId]);
  useEffect(() => {
    const fetchContributionById = async () => {
      await getContributionById(contributionId);
    };
    fetchContributionById();
  }, [contributionId, contributions]);

  // fetchAllSubmission for marketer coordinator
  useEffect(() => {
    if (role !== "student") {
      fetchAllSubmission();
    }
  }, []);

  useEffect(() => {
    const getSubmission = async () => {
      if (role === "student") {
        getSubmissionByStudent(contributionId);
      } else {
        if (submissionId) getSubmissionById(submissionId);
      }
    };
    getSubmission();
  }, [contributionId, submissions]);

  function formattedDate(date: string) {
    return format(date, "HH:mm dd/MM/yyyy");
  }

  return (
    <div className="grid grid-rows-[auto_1fr]">
      {!loadingSubmission && (
        <MainHeader isUnsubmittable={isUnsubmittable} isEditable={isEditable}>
          <div className="relative flex items-center">
            {role === "student" ? (
              <h1
                className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
                onClick={() => navigate("/student")}
              >
                Your Submission
              </h1>
            ) : (
              <h1
                className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
                onClick={() => navigate("/myFaculty")}
              >
                My Faculty
              </h1>
            )}
            <img src={BreadcrumbPointer} />

            {role !== "student" && (
              <>
                <h1
                  className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
                  onClick={() =>
                    navigate(
                      `/myFaculty/contributions/${submission.contributionId._id}`,
                    )
                  }
                >
                  {role === "student"
                    ? `${contribution.academicYear} Contributions`
                    : `${submission.contributionId.academicYear} Contributions`}
                </h1>
                <img src={BreadcrumbPointer} />
              </>
            )}

            <Dropdowns>
              <Dropdowns.Dropdown>
                <Dropdowns.Toggle id={submission._id}>
                  <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                    <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                      {role === "student"
                        ? `${contribution.academicYear} Contributions`
                        : `${submission.student.name}`}
                    </h1>
                    <img src={DropdownIcon} alt="" />
                  </span>
                </Dropdowns.Toggle>

                <Dropdowns.List id={submission._id}>
                  <Dropdowns.Button icon={DropdownIcon}>
                    Download
                  </Dropdowns.Button>
                  <Dropdowns.Button icon={DropdownIcon}>
                    Delete
                  </Dropdowns.Button>
                </Dropdowns.List>
              </Dropdowns.Dropdown>
            </Dropdowns>

            {role === "student" && contribution.closureDate && (
              <p
                className={`text-sm font-normal italic 
                ${today.getTime() < new Date(contribution.closureDate).getTime() ? "text-[#004AD7]" : "text-[#8B8989]"}`}
              >
                {`Closure Date: ${formattedDate(contribution.closureDate)}

                ${today.getTime() < new Date(contribution.closureDate).getTime() ? "" : "(closed)"}`}
              </p>
            )}
          </div>
        </MainHeader>
      )}

      {loadingSubmission ? (
        <Spinner />
      ) : (
        <div className="my-5 flex flex-col gap-5 xl:ps-6">
          {submissionId ? (
            <SubmissionTable />
          ) : (
            contribution.closureDate && (
              <SubmissionEmpty
                isSubmissionOpen={
                  today.getTime() < new Date(contribution.closureDate).getTime()
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
