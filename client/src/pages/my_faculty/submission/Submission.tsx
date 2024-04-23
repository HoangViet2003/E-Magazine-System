import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSubmission } from "../../../redux/hooks/useSubmission";
import { useCommentContext } from "../../../ui/CommentContext";
import { useArticle, useContribution } from "../../../redux/hooks";
import { format } from "date-fns";

import useWindowWidth from "../../../redux/hooks/useWindowWidth";
import SubmissionTable from "./SubmissionTable";
import SubmissionEmpty from "./SubmissionEmpty";
import MainHeader from "../../../ui/MainHeader";
import Dropdowns from "../../../ui/Dropdowns";
import Spinner from "../../../ui/Spinner";
import Comment from "../../../ui/Comment";

import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import CommentIcon from "../../../assets/icons/comment_duotone.svg";
import UnsubmitIcon from "../../../assets/icons/Refresh_light.svg";
import TrashIcon from "../../../assets/icons/trash.svg";

export default function Submission() {
  const windowWidth = useWindowWidth();
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contributionId = searchParams.get("contributionId") || "";
  const { submissionId } = useParams();

  const [page, setPage] = useState(1);
  const today = new Date();
  const [isEditableOn, setIsEditableOn] = useState(false);
  const { openComment, setOpenComment } = useCommentContext();
  const [allowComment, setAllowComment] = useState(true);

  const { contribution, getContributionById } = useContribution();
  const {
    submission,
    isLoading: loadingSubmission,
    getSubmissionByContributionStudent,
    getSubmissionById,
    toggleForSubmit,
    deleteSubmission,
  } = useSubmission();
  const {
    submissionArticles,
    getArticlesBySubmissionId,
    resetSubmissionArticlesState,
  } = useArticle();

  function formattedDate(date: string) {
    return format(date, "HH:mm dd/MM/yyyy");
  }

  const checkIfOver14Days = () => {
    const today = new Date();
    const createdAt = new Date(submission?.createdAt);

    const differenceInTime = today.getTime() - createdAt.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 14) {
      setAllowComment(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (role === "student" && contributionId && submissionId) {
        getSubmissionByContributionStudent(contributionId);
      } else if (submissionId) {
        getSubmissionById(submissionId);
      }

      if (submissionId) getArticlesBySubmissionId(submissionId, page);
      checkIfOver14Days();

      return () => resetSubmissionArticlesState();
    };
    fetchData();
  }, [contributionId, page, role, submissionId]);

  useEffect(() => {
    const fetchContributionById = async () => {
      getContributionById(contributionId);
    };
    fetchContributionById();
  }, []);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setPage(page);
  }, [searchParams]);

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

  function handleToggleSubmit() {
    if (submission.isSelectedForPublication) {
      alert("Submission is selected for submission");
      return;
    }

    if (submissionArticles.some((article) => article.type === "word"))
      toggleForSubmit(submissionId);
    else {
      alert("Submission require at least 1 document file.");
    }
  }

  return (
    <div className="grid grid-rows-[auto_auto_1fr]">
      {!loadingSubmission && (
        <MainHeader
          isEditable={isEditable}
          setIsEditableOn={setIsEditableOn}
          isEditableOn={isEditableOn}
        >
          <div className="relative flex items-center">
            {windowWidth > 1536 && (
              <>
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
                        navigate(`/myFaculty/contributions/${contribution._id}`)
                      }
                    >
                      {`${contribution.academicYear} Contributions`}
                    </h1>
                    <img src={BreadcrumbPointer} />
                  </>
                )}
              </>
            )}

            <Dropdowns>
              <Dropdowns.Dropdown>
                <Dropdowns.Toggle id={`current ${submission._id}`}>
                  <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                    {submissionArticles && (
                      <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                        {role === "student"
                          ? `${contribution.academicYear} Contributions`
                          : `${submission.student?.name}`}
                      </h1>
                    )}
                    <img src={DropdownIcon} />
                  </span>
                </Dropdowns.Toggle>

                {isUnsubmittable && role === "student" && (
                  <Dropdowns.List id={`current ${submission._id}`}>
                    <Dropdowns.Button
                      icon={UnsubmitIcon}
                      onClick={handleToggleSubmit}
                    >
                      <span className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100">
                        {submission.unsubmitted ? "Submit" : "Unsubmit"}
                      </span>
                    </Dropdowns.Button>

                    <Dropdowns.Button
                      icon={TrashIcon}
                      onClick={async () => {
                        await deleteSubmission(submissionId);
                      }}
                    >
                      <span className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100">
                        Remove
                      </span>
                    </Dropdowns.Button>
                  </Dropdowns.List>
                )}
              </Dropdowns.Dropdown>
            </Dropdowns>

            {role === "student" && contribution.closureDate && (
              <p
                className={`hidden whitespace-nowrap text-sm font-normal italic 2xl:block
                ${today.getTime() < new Date(contribution.closureDate).getTime() ? "text-[#004AD7]" : "text-[#8B8989]"}`}
              >
                {`Closure Date: ${formattedDate(contribution.closureDate)}

                ${today.getTime() < new Date(contribution.closureDate).getTime() ? "" : "(closed)"}`}
              </p>
            )}
          </div>
        </MainHeader>
      )}

      {role === "student" && !loadingSubmission && submission._id && (
        <div
          className={`mt-4 rounded-md p-4 ${submission.unsubmitted ? "bg-red-100" : "bg-green-100"} `}
        >
          {`Status: ${submission.unsubmitted ? "Not submitted" : "Submitted"}`}
        </div>
      )}

      {loadingSubmission ? (
        <Spinner />
      ) : (
        <div className="my-5 flex flex-col gap-5 xl:ps-6">
          {submissionId &&
            ((submission?.articles?.length ?? 0) !== 0 ||
              role !== "student") && (
              <SubmissionTable isEditableOn={isEditableOn} />
            )}

          {submissionId &&
            role === "student" &&
            contribution.closureDate &&
            (submission?.articles?.length ?? 0) === 0 && (
              <SubmissionEmpty
                hasSubmission={true}
                isSubmissionOpen={
                  today.getTime() < new Date(contribution.closureDate).getTime()
                }
              />
            )}

          {!submissionId && contribution.closureDate && role === "student" && (
            <SubmissionEmpty
              isSubmissionOpen={
                today.getTime() < new Date(contribution.closureDate).getTime()
              }
            />
          )}

          {!openComment &&
            submissionId &&
            (role === "student" || role === "marketing coordinator") && (
              <button
                className="fixed bottom-0 right-4 -z-0 flex items-center gap-3 border border-borderColor px-2 py-1 shadow-[0_0px_12px_rgba(0,0,0,0.10)] hover:bg-slate-100"
                onClick={() => setOpenComment(!openComment)}
              >
                <img src={CommentIcon} />
                Comments
              </button>
            )}

          {submissionId &&
            (role === "student" || role === "marketing coordinator") && (
              <Comment allowComment={allowComment} />
            )}
        </div>
      )}
    </div>
  );
}
