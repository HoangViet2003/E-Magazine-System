import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSubmission } from "../../../redux/hooks/useSubmission";

import MainHeader from "../../../ui/MainHeader";
import Dropdowns from "../../../ui/Dropdowns";
import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import SubmissionTable from "./SubmissionTable";

export default function Submission() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const {
    submission,
    submissions,
    isLoading: loadingSubmission,
    getSubmissionByStudent,
    fetchAllSubmission,
    getSubmissionById,
  } = useSubmission();

  useEffect(() => {
    fetchAllSubmission();
  }, []);

  useEffect(() => {
    const getSubmission = async () => {
      if (role === "student") {
        getSubmissionByStudent();
      } else {
        getSubmissionById(submissionId);
      }
    };

    getSubmission();
  }, [submissions]);

  return (
    <div>
      {!loadingSubmission && (
        <MainHeader>
          <div className="relative flex items-center">
            <h1
              className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
              onClick={() => navigate("/myFaculty")}
            >
              My Faculty
            </h1>
            <img src={BreadcrumbPointer} />

            <h1
              className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
              onClick={() =>
                role === "student"
                  ? navigate(
                      `/student/contributions/${submission.contributionId._id}`,
                    )
                  : navigate(
                      `/myFaculty/contributions/${submission.contributionId._id}`,
                    )
              }
            >
              {role === "student"
                ? `${submission.contributionId.academicYear} Contributions`
                : `${submission.contributionId.academicYear} Contributions`}
            </h1>

            {submissionId && role !== "student" && (
              <>
                <img src={BreadcrumbPointer} />
                <Dropdowns>
                  <Dropdowns.Dropdown>
                    <Dropdowns.Toggle id={submissionId}>
                      <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                        <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                          {submission.user.name}
                        </h1>
                        <img src={DropdownIcon} alt="" />
                      </span>
                    </Dropdowns.Toggle>

                    <Dropdowns.List id={submissionId}>
                      <Dropdowns.Button icon={DropdownIcon}>
                        Download
                      </Dropdowns.Button>
                      <Dropdowns.Button icon={DropdownIcon}>
                        Delete
                      </Dropdowns.Button>
                    </Dropdowns.List>
                  </Dropdowns.Dropdown>
                </Dropdowns>
              </>
            )}
          </div>
        </MainHeader>
      )}

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <SubmissionTable />
      </div>
    </div>
  );
}
