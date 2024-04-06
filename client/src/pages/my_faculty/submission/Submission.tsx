import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSubmission } from "../../../redux/hooks/useSubmission";

import MainHeader from "../../../ui/MainHeader";
import Dropdowns from "../../../ui/Dropdowns";
import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import SubmissionTable from "./SubmissionTable";
import { useArticle, useContribution } from "../../../redux/hooks";
import SubmissionEmpty from "./SubmissionEmpty";
import Spinner from "../../../ui/Spinner";
import { format } from "date-fns";
import useWindowWidth from "../../../redux/hooks/useWindowWidth";
import CommentIcon from "../../../assets/icons/comment_duotone.svg";
import Comment from "../../../ui/Comment";

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
  const [openComment, setOpenComment] = useState(false);

  const { contribution, getContributionById } = useContribution();
  const {
    submission,
    isLoading: loadingSubmission,
    getSubmissionByContributionStudent,
    getSubmissionById,
  } = useSubmission();
  const {
    submissionArticles,
    getArticlesBySubmissionId,
    resetSubmissionArticlesState,
    setSelectedArticlesToState,
  } = useArticle();

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

  function formattedDate(date: string) {
    return format(date, "HH:mm dd/MM/yyyy");
  }

  useEffect(() => {
    const fetchContributionById = async () => {
      getContributionById(contributionId);
    };
    fetchContributionById();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (role === "student" && contributionId) {
        getSubmissionByContributionStudent(contributionId);
      } else if (submissionId) {
        getSubmissionById(submissionId);
      }

      if (submissionId) getArticlesBySubmissionId(submissionId, page);

      return () => resetSubmissionArticlesState();
    };
    fetchData();
  }, [contributionId, page, role, submissionId]);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setPage(page);
  }, [searchParams]);

  useEffect(() => {
    setSelectedArticlesToState([]);
  }, [isEditableOn, setSelectedArticlesToState]);

  return (
    <div className="grid grid-rows-[auto_1fr]">
      {!loadingSubmission && (
        <MainHeader
          isUnsubmittable={isUnsubmittable}
          isEditable={isEditable}
          submission={submission}
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
                    {submissionArticles && submissionArticles.length > 0 && (
                      <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                        {role === "student"
                          ? `${contribution.academicYear} Contributions`
                          : `${submissionArticles[0].student?.name}`}
                      </h1>
                    )}
                    <img src={DropdownIcon} alt="" />
                  </span>
                </Dropdowns.Toggle>

                <Dropdowns.List id={`current ${submission._id}`}>
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
                className={`whitespace-nowrap text-sm font-normal italic
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

          {!openComment && (
            <button
              className="fixed bottom-0 right-4 flex items-center gap-3 border border-borderColor px-2 py-1 shadow-[0_0px_12px_rgba(0,0,0,0.10)] hover:bg-slate-100"
              onClick={() => setOpenComment(!openComment)}
            >
              <img src={CommentIcon} />
              Comments
            </button>
          )}

          <Comment openComment={openComment} setOpenComment={setOpenComment} />
        </div>
      )}
    </div>
  );
}
